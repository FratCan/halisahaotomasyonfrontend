import React, { createContext, useState, useContext } from 'react';

const FieldContext = createContext();

export const useFieldContext = () => useContext(FieldContext);

export const FieldProvider = ({ children }) => {
  const [fields, setFields] = useState([
    {
      id: 1,
      name: "Green Valley Field",
      district: "Central District",
      hours: "08:00 - 22:00",
      lighted: true,
      price: 50,
      available: true,
      image: "/saha1.jpg",
    },
    {
      id: 2,
      name: "Blue Moon Arena",
      district: "West District",
      hours: "09:00 - 21:00",
      lighted: true,
      price: 65,
      available: true,
      image: "/saha2.jpg",
    },
    {
      id: 3,
      name: "Sunset Field",
      district: "East District",
      hours: "08:00 - 20:00",
      lighted: false,
      price: 40,
      available: false,
      image: "/saha3.jpg",
    },
    {
      id: 4,
      name: "Green Valley Field",
      district: "Central District",
      hours: "08:00 - 22:00",
      lighted: true,
      price: 50,
      available: true,
      image: "/saha1.jpg",
    },
    {
      id: 5,
      name: "Blue Moon Arena",
      district: "West District",
      hours: "09:00 - 21:00",
      lighted: true,
      price: 65,
      available: true,
      image: "/saha2.jpg",
    },
    {
      id: 6,
      name: "Sunset Field",
      district: "East District",
      hours: "08:00 - 20:00",
      lighted: false,
      price: 40,
      available: false,
      image: "/saha3.jpg",
    },
    {
      id: 7,
      name: "Sunset Field",
      district: "East District",
      hours: "08:00 - 20:00",
      lighted: false,
      price: 40,
      available: false,
      image: "/saha3.jpg",
    },
  ]);

  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "Barankaya",
      hotwater: true,
      shower: true,
      toilet: true,
      shoes: true,
      phone: "02849632154",
      cafe: true,
      uniform: true,
      transport: true,
      image: "/tesis.jpg",
      eldiven: true,
    },
  ]);

  const updateField = (updatedField) => {
    const updatedFields = fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    setFields(updatedFields);
  };

  const updateFacility = (updatedFacility) => {
    const updatedFacilities = facilities.map((facility) =>
      facility.id === updatedFacility.id ? updatedFacility : facility
    );
    setFacilities(updatedFacilities);
  };

  return (
    <FieldContext.Provider value={{ fields, facilities, updateField, updateFacility }}>
      {children}
    </FieldContext.Provider>
  );
};
