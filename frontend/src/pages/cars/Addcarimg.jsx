import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Addcarimg() {
  const { id: car_id } = useParams();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // إنشاء معاينة
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Veuillez sélectionner une image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const response = await axios.put(
        `http://localhost:3000/api/cars/add/image/${car_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("✅ Image ajoutée avec succès !");
      console.log(response.data);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Erreur:", error.response?.data?.message || error.message);
      alert("❌ Erreur lors de l'ajout de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4 text-center text-primary">Ajouter une image pour le véhicule</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="file" className="form-label fw-bold">
              Choisir une image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
              id="file"
              required
            />
          </div>

          {preview && (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="Aperçu"
                className="img-thumbnail"
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isUploading}
          >
            {isUploading ? "Téléchargement en cours..." : "Ajouter l'image"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Addcarimg;
