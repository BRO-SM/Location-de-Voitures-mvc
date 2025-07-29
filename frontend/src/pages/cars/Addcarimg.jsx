import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


function Addcarimg() {
  const { id: car_id } = useParams();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]); // لتخزين الصور من السيرفر
  const navigate = useNavigate(); // pour rediriger après l'upload
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/cars/images/${car_id}`
      );
      setImages(response.data.images);
    } catch (error) {
      console.error("Erreur lors de récupération des images:", error);
      setImages([]); // اجعل الصور فارغة إذا خطأ
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
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
      await axios.put(
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
      setFile(null);
      setPreview(null);
      fetchImages(); // تحديث الصور بعد الإضافة
    } catch (error) {
      console.error("Erreur:", error.response?.data?.message || error.message);
      alert("❌ Erreur lors de l'ajout de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  // حذف صورة
  const handleDeleteImage = async (imgId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette image?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/cars/images/${imgId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("🗑️ Image supprimée avec succès");
      fetchImages();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("❌ Erreur lors de la suppression de l'image");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow">
        <NavLink
          to={`/carDetails/${car_id}`}
          className="btn btn-danger btn-sm position-absolute top-0 end-0"
          style={{ zIndex: 10 }}
        >
          X
        </NavLink>

        <h2 className="mb-4 text-center text-primary">
          Ajouter une image pour le véhicule
        </h2>

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

        <hr className="my-4" />

        <h3 className="mb-3">Images existantes</h3>
        <div className="d-flex flex-wrap gap-3">
          {images.length === 0 && <p>Aucune image pour ce véhicule.</p>}
          {images.map((img) => (
            <div
              key={img.img_id}
              className="position-relative"
              style={{ width: 150 }}
            >
              <img
                src={`http://localhost:3000/uploads/cars/${img.img_url}`}
                alt="Car"
                className="img-thumbnail"
                style={{ width: "100%", height: "auto" }}
              />
              <button
                onClick={() => handleDeleteImage(img.img_id)}
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                style={{ zIndex: 10 }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Addcarimg;
