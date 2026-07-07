const prompt = require("prompt-sync")();


// pokedex.js

// Esta función solo se encarga de buscar y traer la información
async function buscarPokemon(nombre) {
    // 1. Convertimos el nombre a minúsculas porque la API es estricta con eso
    const nombreMinuscula = nombre.toLowerCase();
    const url = "https://pokeapi.co/api/v2/pokemon/" + nombreMinuscula;

    // 2. Vamos a buscar los datos
    const respuesta = await fetch(url);

    // 3. Verificamos si la respuesta NO fue exitosa (ej. si escribimos mal el nombre)
    if (!respuesta.ok) {
        console.log("Error: No se encontró al Pokémon '" + nombre + "'. Status:", respuesta.status);
        return null; // Retornamos 'nulo' (nada) para que el programa no se rompa
    }

    // 4. Si todo salió bien, devolvemos los datos listos para usar
    const datos = await respuesta.json();
    return datos;
}

// -- EJERCICIO 2 (Prueba) --
// Para probarlo, usamos otra función async
async function probarBusqueda() {
    const poke1 = await buscarPokemon("charizard");
    if (poke1 !== null) console.log("ID de Charizard:", poke1.id);

    // Prueba con uno que no existe para ver nuestro mensaje de error
    const pokeError = await buscarPokemon("andres"); 
}
 //probarBusqueda(); // Descomenta esta línea si quieres probar que funciona, luego vuelve a comentarla.

 function mostrarFicha(datos) {
    // 1. Si no hay datos (porque hubo un error en la búsqueda), salimos de la función
    if (datos === null) return;

    console.log("\n==================================");
    // 2. Nombre en mayúsculas (.toUpperCase()) y su ID
    console.log("Nombre: " + datos.name.toUpperCase() + " (#" + datos.id + ")");

    // 3. Unir los tipos con un "/" 
    // Creamos una lista vacía, le metemos los nombres de los tipos y los unimos (.join)
    let nombresTipos = [];
    for (const t of datos.types) {
        nombresTipos.push(t.type.name);
    }
    console.log("Tipos: " + nombresTipos.join(" / "));

    // 4. Altura en cm y peso en kg
    console.log("Altura: " + (datos.height * 10) + " cm");
    console.log("Peso: " + (datos.weight / 10) + " kg");

    // 5. Mostrar stats
    console.log("--- Stats ---");
    for (const stat of datos.stats) {
        console.log("  " + stat.stat.name + ": " + stat.base_stat);
    }

    // 6. Mostrar habilidades y ver si son ocultas
    console.log("--- Habilidades ---");
    for (const habilidad of datos.abilities) {
        let textoHabilidad = habilidad.ability.name;
        if (habilidad.is_hidden === true) {
            textoHabilidad = textoHabilidad + " (oculta)";
        }
        console.log("  - " + textoHabilidad);
    }
    console.log("==================================\n");
}

// -- EJERCICIO 3 (Prueba) --
async function probarFicha() {
    const bulbasaur = await buscarPokemon("bulbasaur");
    mostrarFicha(bulbasaur);
}
 //probarFicha(); // Descomenta para probar

 // 4.1 Función auxiliar: Solo extrae el numerito de una stat específica
function obtenerStat(datos, nombreStat) {
    for (const stat of datos.stats) {
        if (stat.stat.name === nombreStat) {
            return stat.base_stat; // Encontramos la stat, devolvemos el valor y cortamos
        }
    }
    return null; // Si termina el bucle y no encontró nada
}

// 4.2 La función principal de comparación
async function compararPokemon(nombre1, nombre2, stat) {
    console.log("Comparando " + nombre1 + " vs " + nombre2 + " en [" + stat + "]");
    
    const poke1 = await buscarPokemon(nombre1);
    const poke2 = await buscarPokemon(nombre2);

    // Si alguno no existe, cortamos
    if (poke1 === null || poke2 === null) {
        console.log("No se pudo realizar la comparación por falta de datos.");
        return; 
    }

    const valor1 = obtenerStat(poke1, stat);
    const valor2 = obtenerStat(poke2, stat);

    // Si la stat no existe (ej. escribiste "fuerza" en vez de "attack")
    if (valor1 === null || valor2 === null) {
        console.log("La stat '" + stat + "' no existe. Las válidas son: hp, attack, defense, special-attack, special-defense, speed.");
        return;
    }

    console.log(poke1.name + " tiene " + valor1);
    console.log(poke2.name + " tiene " + valor2);

    if (valor1 > valor2) {
        console.log("🏆 ¡GANADOR: " + poke1.name.toUpperCase() + "!");
    } else if (valor2 > valor1) {
        console.log("🏆 ¡GANADOR: " + poke2.name.toUpperCase() + "!");
    } else {
        console.log("🤝 ¡Es un empate!");
    }
}

// --- BÚSQUEDA INTERACTIVA ---
async function buscarConPrompt() {
    console.log("\n--- BÚSQUEDA POKÉMON ---");
    // 1. Le pedimos el dato al usuario
    const nombreBuscado = prompt("¿Qué Pokémon quieres buscar? (ej. pikachu): ");
    
    // 2. Usamos la función que ya creamos antes
    const datos = await buscarPokemon(nombreBuscado);
    
    // 3. Mostramos la ficha
    mostrarFicha(datos);
}

// --- COMPARACIÓN INTERACTIVA ---
async function compararConPrompt() {
    console.log("\n--- ZONA DE BATALLA ---");
    const luchador1 = prompt("Ingresa el primer Pokémon: ");
    const luchador2 = prompt("Ingresa el segundo Pokémon: ");
    const stat = prompt("¿En qué stat pelearán? (hp, attack, defense, speed...): ");

    await compararPokemon(luchador1, luchador2, stat);
}

// Descomenta la que quieras usar:
//buscarConPrompt();
 compararConPrompt();
