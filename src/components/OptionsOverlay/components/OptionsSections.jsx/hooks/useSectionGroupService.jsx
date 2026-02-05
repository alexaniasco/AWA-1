
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../../../context/AppContext';
import * as THREE from "three";

const useSectionGroupService = () => {

    const [currentText, setCurrentText] = useState('initial');

    const {
        maletinRef, cajafuerteRef, swapModelPositions, coinRef, moveModelTo, astronautaRef } = useContext(AppContext);

        const handleButtonClick = (section) => {
            if (section === "EMPRESA") {
                setCurrentText('secondary');
                moveModelTo(coinRef, new THREE.Vector3(-3, 0, 10))
                moveModelTo(cajafuerteRef, new THREE.Vector3(0.7, 0.2, 10))
            }
            else if (section === "EMPRESA2") {
                setCurrentText('initial');
                moveModelTo(coinRef, new THREE.Vector3(0.2, 0.5, 10))
                moveModelTo(cajafuerteRef, new THREE.Vector3(-3, 0, 10))
            }
            else if (section === "PROFESIONAL") {
                setCurrentText('secondary');
                moveModelTo(coinRef, new THREE.Vector3(10, 0, 10))
                moveModelTo(astronautaRef, new THREE.Vector3(-0.8, 0.5, 10))
            }
            else if (section === "PROFESIONAL2") {
                setCurrentText('initial');
                moveModelTo(coinRef, new THREE.Vector3(-0.4, 0.5, 10))
                moveModelTo(astronautaRef, new THREE.Vector3(10, 0, 10))
            }
            else if (section === "EXCLUSIVO2") {
                setCurrentText('initial');
                moveModelTo(coinRef, new THREE.Vector3(-0.1, 0, 10))
                moveModelTo(maletinRef, new THREE.Vector3(-3, 0, 10))
            } else if (section === "EXCLUSIVO") {
                setCurrentText('secondary');
                moveModelTo(coinRef, new THREE.Vector3(-3, 0, 10))
                moveModelTo(maletinRef, new THREE.Vector3(0.3, -0.4, 10))
    
            }
        };

  return { handleButtonClick , currentText , setCurrentText };
};

export default useSectionGroupService;
