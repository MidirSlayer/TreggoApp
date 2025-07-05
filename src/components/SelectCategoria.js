import React, {useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Select from "./Select";
import { obtenerTiposTrabajo, ObtenerSubtipos } from "../services/supabase";

export default function SelectCategoria({onChange}) {
    const [categorias, setCategorias] = useState([])
    const [subcategorias,setSubcategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState('');
    const [subcategoriaActiva, setSubcategoriaActiva] = useState('')

    useEffect(() => {
        async function cargarCategorias() {
            const data = await obtenerTiposTrabajo();
            setCategorias(data);
            console.log('categooria',data)
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
        <View style={styles.rowContainer}>
            <View style={styles.selectWrapper}>
            <Select
                style={styles.select}
                placeholder="Categorias"
                options={categorias.map(c => ({label: c.nombre, value: c}))}
                selectedValue={categoriaActiva}
                onValueChange={setCategoriaActiva}
            />
            </View>
            <View style={styles.selectContainer}>
            {subcategorias.length > 0 && (
                <Select
                    style={styles.select}
                    placeholder="Subcategoria"
                    selectedValue={subcategoriaActiva}
                    options={subcategorias.map(s => ({label: s.nombre, value: s}))}
                    onValueChange={setSubcategoriaActiva}
                />
            )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: -8,
        marginTop: 5
    },
    selectWrapper: {
        flex: 1,
        marginRight: 8,
    },
    select: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 8,
        fontSize: 14,
        width: 200
    },
});