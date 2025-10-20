import React from "react";
import Demo from "./components/Demo";
import BoneLogo from "./assets/bone.jpg";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-blue-100 to-white flex flex-col">
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <img src={BoneLogo} alt="Logo os" className="w-12 h-12" />
    <div>
      <h1 className="text-2xl font-extrabold text-brand-blue-700">FractureDetector</h1>
      <div className="text-sm text-gray-500">Détection d'os fracturés par IA</div>
    </div>
  </div>
  <nav>
    <a className="px-4 py-2 rounded-md text-sm bg-white/60 backdrop-blur hover:bg-white" href="#demo">Démonstration</a>
  </nav>
</header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-brand-blue-700 leading-tight">
              Détecteur de fractures osseuses — Rapide & fiable
            </h2>
            <p className="text-gray-600">
              Téléverse une radiographie, notre modèle analyse l'image et encadre les zones suspectes.
              Interface simple, résultat visuel et prêt à intégrer dans un flux clinique.
            </p>
            <div className="flex gap-3">
              <a href="#demo" className="inline-block bg-brand-blue-500 text-white px-5 py-3 rounded-lg shadow hover:bg-brand-blue-700 transition">Essayer maintenant</a>
              <a className="inline-block border border-brand-blue-200 text-brand-blue-700 px-5 py-3 rounded-lg hover:bg-white/50">En savoir plus</a>
            </div>
          </div>

          <div className="rounded-xl p-6 bg-white/60 shadow-lg" id="demo">
            <Demo />
          </div>
        </section>
      </main>

      <footer className="w-full border-t mt-8">
        <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
          <div>© {new Date().getFullYear()} FractureDetector</div>
          <div>Conçu avec ❤️ • Tailwind CSS</div>
        </div>
      </footer>
    </div>
  );
}