import React, { useEffect, useState } from "react";
import { fireDb, storage } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom"; // Import correct
import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function FirebaseFirestore() {
  const [id, setId] = useState("");
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [pin, setpin] = useState("");
  const [country, setcountry] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [val, setVal] = useState([]);

  const value = collection(fireDb, "User");

  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    const getData = async () => {
      const dbVal = await getDocs(value);
      setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  }, []);

  const handleCreateAndUpload = async () => {
    // verifier si les champs sont vide
    if (!name || !address || !city || !pin || !country) {
      toast.error("champ requis");
      return;
    }
    // verifier si le champ image est vide
    if (imageUpload === null) {
      toast.error("ajouter une image");
      return;
    }
    // creation du dossier de stockage et la synchronisation de l'image ajoutée
    const imageRef = storageRef(storage, `photos/${uuid()}`);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);

      await addDoc(value, {
        name: name,
        address: address,
        city: city,
        pin: pin,
        country: country,
        imageUrl: url,
      });

      setname("");
      setaddress("");
      setcity("");
      setpin("");
      setcountry("");
      setImageUpload(null);

      toast.success("ajouté avec succès");

      // Redirection après l'ajout réussi
      navigate("/");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="login-box">
      <h2>AJOUTE ETUDIANT</h2>
      <form>
        <div className="user-box">
          <input
            className="form-control p-2"
            label="Image"
            placeholder="Choose image"
            accept="image/png,image/jpeg"
            type="file"
            onChange={(e) => {
              setImageUpload(e.target.files[0]);
            }}
          />
        </div>
        <div className="user-box">
          <input
            placeholder="NAME"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            placeholder="ADDRESS"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            placeholder="CITY"
            value={city}
            onChange={(e) => setcity(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            placeholder="PIN"
            value={pin}
            onChange={(e) => setpin(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            placeholder="COUNTRY"
            value={country}
            onChange={(e) => setcountry(e.target.value)}
          />
        </div>
      </form>
      <div className="col-lg-12">
        <button onClick={handleCreateAndUpload}>Create</button>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default FirebaseFirestore;
