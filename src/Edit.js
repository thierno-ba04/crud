import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fireDb, storage } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate hook to redirect after update
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [pin, setpin] = useState("");
  const [country, setcountry] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // State for current image URL

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(fireDb, "User", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setname(data.name);
        setaddress(data.address);
        setcity(data.city);
        setpin(data.pin);
        setcountry(data.country);
        setCurrentImageUrl(data.imageUrl); // Set current image URL
      } else {
        console.log("il n'y a pas de document à afficher !");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      let imageUrl = currentImageUrl;

      if (imageUpload) {
        const imageRef = storageRef(storage, `photos/${uuid()}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = doc(fireDb, "User", id);
      await updateDoc(docRef, {
        name: name,
        address: address,
        city: city,
        pin: pin,
        country: country,
        imageUrl: imageUrl, // Update the image URL
      });

      toast.success("Utilisateur mis à jour avec succès");
      navigate("/"); // Redirect to the main page after update
    } catch (error) {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    }
  };

  return (
    <div className="login-box">
      <h2>Edit ETUDIANT</h2>
      <form>
        <div className="user-box">
          {currentImageUrl && (
            <img src={currentImageUrl} alt="Current" width="100" />
          )}
          <input
            className="form-control p-2"
            label="Image"
            placeholder="Choose image"
            accept="image/png,image/jpeg"
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </div>
        <div className="user-box">
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
        </div>
        <div className="user-box">
          <input
            value={address}
            onChange={(e) => setaddress(e.target.value)}
            required
          />
        </div>
        <div className="user-box">
          <input
            value={city}
            onChange={(e) => setcity(e.target.value)}
            required
          />
        </div>
        <div className="user-box">
          <input
            value={pin}
            onChange={(e) => setpin(e.target.value)}
            required
          />
        </div>
        <div className="user-box">
          <input
            value={country}
            onChange={(e) => setcountry(e.target.value)}
            required
          />
        </div>
      </form>
      <div className="col-lg-12">
        <button onClick={handleUpdate}>Mettre à jour</button>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default Edit;
