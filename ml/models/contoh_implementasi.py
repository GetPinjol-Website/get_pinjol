# webapp/app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS # Untuk menangani Cross-Origin Resource Sharing
import pickle
import pandas as pd
import numpy as np
import re
import string
import json

# --- Impor dan Inisialisasi Komponen Preprocessing ---
# (Anda mungkin perlu Sastrawi jika stemming adalah bagian dari clean_text)
# from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
# from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

app = Flask(__name__)
CORS(app) # Mengizinkan permintaan dari domain lain (penting untuk pengembangan lokal)

# --- PATH ke Model dan Data ---
TFIDF_VECTORIZER_PATH = 'models/tfidf_vectorizer.pkl'
SENTIMENT_MODEL_PATH = 'models/sentiment_model_sklearn.pkl'
NORMALIZATION_DICT_PATH = 'models/normalization_dict.json'
# Path untuk data OJK (opsional, jika fungsi rekomendasi aplikasi digunakan)
# DS_LEGAL_PATH = 'models/ds_legal_ojk.csv'
# DS_ILEGAL_PATH = 'models/ds_ilegal_ojk.csv'

# --- Variabel Global untuk Model dan Data yang Dimuat ---
tfidf_vectorizer = None
sentiment_model = None
normalization_dict_global = {}
# Variabel untuk status legalitas (jika diperlukan)
# legal_companies_set_global = set()
# ilegal_developers_set_global = set()

# --- Fungsi Preprocessing (Salin dari Notebook Anda) ---
# Pastikan fungsi-fungsi ini konsisten dengan yang digunakan saat training!

# Contoh (Anda HARUS mengganti ini dengan implementasi LENGKAP dari notebook Anda):
# stop_factory = None
# stemmer = None
# all_stopwords = []

# def initialize_sastrawi():
#     global stop_factory, stemmer, all_stopwords
#     if stop_factory is None:
#         stop_factory = StopWordRemoverFactory()
#         # Tambahkan custom_stopwords Anda di sini jika ada
#         custom_stopwords = ['yg', 'dg', 'rt', 'dgn', 'ny', 'd', 'klo', 'kalo', 'amp', 'biar', 'bikin', 'bilang', 'gak', 'ga', 'krn', 'nya', 'nih', 'sih', 'si', 'tau', 'tdk', 'tuh', 'utk', 'ya', 'jd', 'jgn', 'sdh', 'aja', 'n', 't', 'nyg', 'hehe', 'pen', 'u', 'nan', 'loh', 'ko', 'dst', 'dll']
#         all_stopwords = stop_factory.get_stop_words() + custom_stopwords
#         all_stopwords = list(set(all_stopwords))
#         stemmer = StemmerFactory().create_stemmer()
#         print("Sastrawi (stemmer & stopwords) diinisialisasi.")

def clean_text_api(text):
    # global stemmer, all_stopwords # Jika menggunakan Sastrawi
    # initialize_sastrawi() # Panggil inisialisasi jika menggunakan Sastrawi

    if pd.isna(text): return ""
    text_lower = str(text).lower()
    text_no_digits = re.sub(r'\d+', '', text_lower)
    # Pastikan string diimpor: import string
    text_no_punct = text_no_digits.translate(str.maketrans('', '', string.punctuation))
    text_no_space = re.sub(r'\s+', ' ', text_no_punct).strip()
    
    # # Contoh jika menggunakan Sastrawi (uncomment jika relevan)
    # words = text_no_space.split()
    # text_no_stopwords = ' '.join([word for word in words if word not in all_stopwords])
    # text_stemmed = stemmer.stem(text_no_stopwords)
    # return text_stemmed
    return text_no_space # Ganti ini jika Anda melakukan stopword removal & stemming

def normalize_slang_api(text, norm_dict):
    if pd.isna(text) or text == "": return ""
    tokens = text.split()
    normalized_tokens = [norm_dict.get(token, token) for token in tokens]
    return " ".join(normalized_tokens)

# --- Fungsi untuk Memuat Model dan Data ---
def load_models_and_data():
    global tfidf_vectorizer, sentiment_model, normalization_dict_global
    # global legal_companies_set_global, ilegal_developers_set_global # Jika ada rekomendasi app

    try:
        with open(TFIDF_VECTORIZER_PATH, 'rb') as f:
            tfidf_vectorizer = pickle.load(f)
        print("TfidfVectorizer berhasil dimuat.")

        with open(SENTIMENT_MODEL_PATH, 'rb') as f:
            sentiment_model = pickle.load(f)
        print("Model sentimen berhasil dimuat.")

        with open(NORMALIZATION_DICT_PATH, 'r') as f:
            normalization_dict_global = json.load(f)
        print("Kamus normalisasi berhasil dimuat.")

        # # Muat data OJK jika diperlukan untuk rekomendasi aplikasi
        # df_legal = pd.read_csv(DS_LEGAL_PATH)
        # df_ilegal = pd.read_csv(DS_ILEGAL_PATH)
        # legal_companies_set_global = set(df_legal['Nama Perusahaan'].astype(str).str.strip().str.lower())
        # ilegal_developers_set_global = set(df_ilegal['DEVELOPER'].fillna('').astype(str).str.strip().str.lower())
        # if '' in ilegal_developers_set_global: ilegal_developers_set_global.remove('')
        # print("Data OJK untuk status legalitas dimuat.")

    except FileNotFoundError as e:
        print(f"Error memuat model/data: File tidak ditemukan - {e}")
    except Exception as e:
        print(f"Error umum saat memuat model/data: {e}")

# --- Endpoint untuk Prediksi Sentimen Ulasan ---
@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment_route():
    if tfidf_vectorizer is None or sentiment_model is None:
        return jsonify({'error': 'Model belum dimuat atau ada kesalahan saat memuat.'}), 500

    try:
        data = request.get_json()
        if 'ulasan' not in data:
            return jsonify({'error': 'Input JSON harus memiliki field "ulasan".'}), 400
        
        ulasan_input = data['ulasan']
        
        # 1. Preprocessing
        ulasan_cleaned = clean_text_api(ulasan_input)
        ulasan_normalized = normalize_slang_api(ulasan_cleaned, normalization_dict_global)
        
        if not ulasan_normalized.strip(): # Jika ulasan kosong setelah preprocessing
            # Tentukan sentimen default atau error
            return jsonify({
                'ulasan_input': ulasan_input,
                'ulasan_processed': "",
                'sentiment_label': 1, # Atau label lain untuk 'tidak dapat ditentukan'
                'sentiment_text': "Netral (Ulasan Kosong)", 
                'probabilities': None
            })

        # 2. Transformasi TF-IDF
        ulasan_tfidf = tfidf_vectorizer.transform([ulasan_normalized])
        
        # 3. Prediksi Sentimen
        # prediksi label (0=Negatif, 1=Netral, 2=Positif)
        predicted_label = sentiment_model.predict(ulasan_tfidf)[0]
        # prediksi probabilitas (jika model mendukung dan Anda inginkan)
        try:
            probabilities = sentiment_model.predict_proba(ulasan_tfidf)[0].tolist()
        except AttributeError: # Jika model tidak punya predict_proba
            probabilities = None 
        
        sentiment_map = {0: 'Negatif', 1: 'Netral', 2: 'Positif'}
        sentiment_text = sentiment_map.get(int(predicted_label), "Tidak Diketahui") # Konversi ke int
        
        return jsonify({
            'ulasan_input': ulasan_input,
            'ulasan_processed': ulasan_normalized,
            'sentiment_label': int(predicted_label), # Pastikan integer
            'sentiment_text': sentiment_text,
            'probabilities': probabilities # Array [prob_neg, prob_netral, prob_pos]
        })

    except Exception as e:
        print(f"Error pada endpoint /predict_sentiment: {e}")
        return jsonify({'error': f'Terjadi kesalahan saat prediksi: {str(e)}'}), 500

# --- (Opsional) Endpoint untuk Rekomendasi Aplikasi (lebih kompleks) ---
# @app.route('/get_recommendation', methods=['POST'])
# def get_recommendation_route():
#     # Mirip dengan fungsi analyze_and_recommend_new_app dari notebook
#     # Akan melibatkan:
#     # 1. Menerima nama aplikasi
#     # 2. Cek DB internal (jika Anda membuat DB dari app_summary_final_sorted)
#     # 3. Jika tidak ada, scraping via google-play-scraper (search, reviews)
#     # 4. Penentuan status legalitas
#     # 5. Preprocessing ulasan baru, prediksi sentimen (menggunakan fungsi di atas)
#     # 6. Logika rekomendasi
#     # Ini akan jauh lebih kompleks dan memakan waktu karena scraping real-time.
#     return jsonify({'message': 'Endpoint rekomendasi aplikasi belum diimplementasikan sepenuhnya.'})


# --- Halaman HTML Sederhana (jika ingin disajikan oleh Flask) ---
@app.route('/')
def index():
    # return "API Sentimen Aktif! Gunakan endpoint /predict_sentiment (POST)."
    return render_template('index.html') # Buat file templates/index.html

if __name__ == '__main__':
    load_models_and_data() # Muat model saat aplikasi dimulai
    app.run(debug=True, host='0.0.0.0', port=5000) # debug=True untuk pengembangan