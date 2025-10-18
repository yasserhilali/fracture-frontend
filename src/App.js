import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [hasPredicted, setHasPredicted] = useState(false); // ✅ Nouvel état pour savoir si la prédiction a été faite
  const canvasRef = useRef(null);

  // Gestion du fichier choisi
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPredictions([]);
    setHasPredicted(false); // Réinitialiser l’état de prédiction
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Envoi de l'image au backend
  const handleUpload = async () => {
    if (!file) return alert("Choisis une image d'abord");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8001/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPredictions(res.data.predictions || []);
      setHasPredicted(true); // ✅ Indique qu'une prédiction a été effectuée
    } catch (err) {
      console.error("Erreur lors de la prédiction :", err);
      alert("Erreur lors de la prédiction. Vérifie la console.");
    }
  };

  // Dessiner les boîtes sur le canvas (sans texte)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      // Si on a des prédictions, dessiner les boîtes rouges
      if (predictions.length > 0) {
        predictions.forEach((pred) => {
          const [x1, y1, x2, y2] = pred.box;
          ctx.strokeStyle = "red";
          ctx.lineWidth = 3;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        });
      }
    };
  }, [imageSrc, predictions]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Détection de fracture</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Envoyer
      </button>

      {imageSrc && (
        <div style={{ marginTop: "20px" }}>
          <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
      )}

      {/* ✅ Afficher le message seulement après une prédiction */}
      {hasPredicted && predictions.length === 0 && (
        <div style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
          Aucune fracture détectée.
        </div>
      )}
    </div>
  );
}

export default App;