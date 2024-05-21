import React, { useEffect, useState } from "react";
import { fireDb } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

function FirebaseFirestore() {
  const [id, setId] = useState("");
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [pin, setpin] = useState("");
  const [country, setcountry] = useState("");

  const [val, setVal] = useState([]);

  const value = collection(fireDb, "User");

  useEffect(() => {
    const getData = async () => {
      const dbVal = await getDocs(value);
      setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  });

  //   c'est l'ajout de user
  const handleCreate = async () => {
    await addDoc(value, {
      name: name,
      address: address,
      city: city,
      pin: pin,
      country: country,
    });
    setname("");
    setaddress("");
    setcity("");
    setpin("");
    setcountry("");
  };

  return (
    <div class="login-box">
      <h2>AJOUTE ETUDIANT</h2>
      <form>
        <div class="user-box">
          <input
            placeholder="NAME"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div class="user-box">
          <input
            placeholder="ADDRESS"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
          />
        </div>

        <div class="user-box">
          <input
            placeholder="CITY"
            value={city}
            onChange={(e) => setcity(e.target.value)}
          />
        </div>

        <div class="user-box">
          <input
            placeholder="PIN"
            value={pin}
            onChange={(e) => setpin(e.target.value)}
          />
        </div>

        <div class="user-box">
          <input
            placeholder="COUNTRY"
            value={country}
            onChange={(e) => setcountry(e.target.value)}
          />
        </div>
      </form>
      <div className="col-lg-12">
        <Link to="/">
        <button onClick={handleCreate}>Create</button>
        </Link>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}
export default FirebaseFirestore;
