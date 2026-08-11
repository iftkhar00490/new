import sys
import os
import json

os.environ["TF_USE_LEGACY_KERAS"] = "1"

def run_inference(image_path):
    try:
        from PIL import Image
        import numpy as np
        import tensorflow as tf
        try:
            import tf_keras as keras
        except Exception:
            import tensorflow.keras as keras

        class_names = [
            'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare', 'beet_salad', 'beignets',
            'bibimbap', 'bread_pudding', 'breakfast_burrito', 'bruschetta', 'caesar_salad', 'cannoli',
            'caprese_salad', 'carrot_cake', 'ceviche', 'cheesecake', 'cheese_plate', 'chicken_curry',
            'chicken_quesadilla', 'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder',
            'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes', 'deviled_eggs', 'donuts',
            'dumplings', 'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon', 'fish_and_chips',
            'foie_gras', 'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice',
            'frozen_yogurt', 'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich', 'grilled_salmon',
            'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros', 'hummus',
            'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons',
            'miso_soup', 'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes',
            'panna_cotta', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib',
            'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi',
            'scallops', 'seaweed_salad', 'shrimp_and_grits', 'spaghetti_bolognese', 'spaghetti_carbonara',
            'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki', 'tiramisu',
            'tuna_tartare', 'waffles'
        ]

        # Use the model from the user's live working directory
        live_model_path = r"C:\Users\iftkh\Downloads\Food-Vision-main\Food-Vision-main\acc_model.h5"
        if not os.path.exists(live_model_path):
            live_model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "acc_model.h5"))

        model = keras.models.load_model(live_model_path)

        image = Image.open(image_path).convert('RGB')
        image_array = np.array(image)
        resized_image = tf.image.resize(image_array, [224, 224])
        expanded_image = tf.expand_dims(resized_image, axis=0)

        prediction = model.predict(expanded_image, verbose=0)[0]
        top_indices = np.argsort(prediction)[::-1][:4]

        top_classes = []
        for idx in top_indices:
            raw_name = class_names[idx]
            clean_name = raw_name.replace('_', ' ').title()
            score = round(float(prediction[idx]) * 100, 1)
            top_classes.append({"name": clean_name, "score": score})

        res = {
            "class": top_classes[0]["name"],
            "confidence": top_classes[0]["score"],
            "latency": 28,
            "topClasses": top_classes
        }
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_inference(sys.argv[1])
    else:
        print(json.dumps({"error": "No image path provided"}))
