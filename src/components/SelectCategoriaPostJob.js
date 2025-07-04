import React, {useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Select from "./Select";
import Texto from "./Text";
import { obtenerTiposTrabajo, ObtenerSubtipos } from "../services/supabase";

export default function SelectCategoriaPostjob({onChange}) {
    const [categorias, setCategorias] = useState([])
    const [subcategorias,setSubcategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState('');
    const [subcategoriaActiva, setSubcategoriaActiva] = useState('')

    useEffect(() => {
        async function cargarCategorias() {
            const data = await obtenerTiposTrabajo();
            setCategorias(data);
            console.log('categorias',data)
        }
        cargarCategorias();
    },[]);

    useEffect(() => {
        async function cargarSubcategoria () {
            if (!categoriaActiva) {
                setSubcategorias([]);
                return;
            }

            const data = await ObtenerSubtipos(categoriaActiva);
            setSubcategorias(data);
            console.log( 'subcategorias',data)
            setSubcategoriaActiva('');
        }

        cargarSubcategoria();
    }, [categoriaActiva]);

    useEffect(() => {
        if (!categoriaActiva && !subcategoriaActiva) return;
        onChange({ 
            categoria: categoriaActiva, 
            subcategoria: subcategoriaActiva
        });
    }, [categoriaActiva, subcategoriaActiva]);


    return (
        <View style={styles.contenedor}>
            <Texto type="subtitle">Seleccione una categoria</Texto>
            <Select
                placeholder="Categorias"
                options={categorias.map(c => ({label: c.nombre, value: c}))}
                selectedValue={categoriaActiva}
                onValueChange={setCategoriaActiva}
            />
            <Texto type="subtitle" >Seleccione una subcategoria</Texto>
                <Select
                    placeholder="Subcategoria"
                    selectedValue={subcategoriaActiva}
                    options={subcategorias.map(s => ({label: s.nombre, value: s}))}
                    onValueChange={setSubcategoriaActiva}
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 16,
  },
});