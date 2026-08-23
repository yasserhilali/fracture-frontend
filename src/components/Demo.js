import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function Demo() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null); // ← ref pour l’input

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPredictions(null);
    setImageSrc(null);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return alert("Choisis une image d'abord");
    setLoading(true);
    setPredictions(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/predict`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      setPredictions(res.data.predictions || []);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la prédiction. Regarde la console du navigateur.");
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImageSrc(null);
    setPredictions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ← réinitialise le champ fichier
    }
  };

  // Dessin sur canvas (inchangé)
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

      if (!predictions || predictions.length === 0) return;

      predictions.forEach((pred) => {
        const [x1, y1, x2, y2] = pred.box;
        ctx.strokeStyle = "red";
        ctx.lineWidth = Math.max(2, Math.round(canvas.width / 250));
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      });
    };
  }, [imageSrc, predictions]);

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border rounded p-2"
        ref={fileInputRef} // ← attacher la ref
      />
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          className="bg-brand-blue-500 text-white px-4 py-2 rounded-lg hover:bg-brand-blue-700 transition"
        >
          Envoyer
        </button>
        <button
          onClick={handleReset}
          className="border px-4 py-2 rounded-lg"
        >
          Réinitialiser
        </button>
      </div>

      <div className="mt-4 w-full max-w-md">
        {imageSrc ? (
          <canvas
            ref={canvasRef}
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
          />
        ) : (
          <div className="p-6 border border-dashed rounded text-gray-500">
            Choisis une image pour voir la prédiction ici.
          </div>
        )}
      </div>

      <div className="mt-3 min-h-[40px]">
        {loading && (
          <div className="flex items-center gap-2 text-blue-500 font-medium">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Prédiction en cours...</span>
          </div>
        )}

        {!loading && predictions !== null && (
          predictions.length === 0 ? (
            <div className="text-green-600 font-medium">Aucune fracture détectée.</div>
          ) : (
            <div className="text-sm text-gray-600">{predictions.length} prédiction(s) affichée(s)</div>
          )
        )}
      </div>
    </div>
  );
}