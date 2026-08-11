import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // 1. Primary: Forward to live hosted Render API endpoint (https://foodvision-api.onrender.com/predict)
    try {
      const renderFormData = new FormData();
      renderFormData.append('file', file, file.name);

      const renderRes = await fetch('https://foodvision-api.onrender.com/predict', {
        method: 'POST',
        body: renderFormData,
        // Set generous timeout for Render cold start
        signal: AbortSignal.timeout(30000),
      });

      if (renderRes.ok) {
        const data = await renderRes.json();
        const latency = Date.now() - startTime;

        if (data.class) {
          const mainClassClean = data.class.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          const mainConfidence = Number((data.confidence * 100).toFixed(1));

          const topClasses = (data.top_5 || []).map((item: any) => ({
            name: item.class.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            score: Number((item.confidence * 100).toFixed(1))
          }));

          return NextResponse.json({
            class: mainClassClean,
            confidence: mainConfidence,
            latency: latency,
            targetDevice: 'Render Cloud API (FastAPI / Keras)',
            topClasses: topClasses
          });
        }
      }
    } catch (renderError) {
      console.warn('Render API call failed or timed out, falling back to local python engine:', renderError);
    }

    // 2. Fallback: Local Python engine (tf_keras / ONNX)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`);
    await writeFile(tempFilePath, buffer);

    const scriptPath = path.join(process.cwd(), 'src', 'data', 'predict_food.py');

    const resultJson = await new Promise<string>((resolve, reject) => {
      execFile('python', [scriptPath, tempFilePath], (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });

    await unlink(tempFilePath).catch(() => {});

    const result = JSON.parse(resultJson);
    const latency = Date.now() - startTime;
    return NextResponse.json({
      ...result,
      latency: latency,
      targetDevice: 'Server-side (CPU)'
    });
  } catch (err: any) {
    console.error('Classification error:', err);
    return NextResponse.json({ error: err.message || 'Inference failed' }, { status: 500 });
  }
}
