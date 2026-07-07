const prompt = require("prompt-sync")();
  async function pedirNombre(){
    //buscarPokemon(nombre);
    for (let i=0;i<3;i++){
      let nombre=prompt("Escribe Nombre: ").toLowerCase();
      await buscarPokemon(nombre);
    }
  }

  async function buscarPokemon(nombre) {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/"+nombre);
    if (!respuesta.ok) {
      console.log("Error:",respuesta.status);
      return null;
    }
    const datos = await respuesta.json();
    return datos;
  }

   function mostrarFicha(datos) {
   if (!datos) return;
 
   console.log("\n----------------------------------------------");
   console.log("Nombre:", datos.name.toUpperCase(), " | ID:", datos.id);
   
   let tipos = [];
   for (let t of datos.types) {
    tipos.push(t.type.name);
   }
   console.log("Tipos:", tipos.join(" / "));
  
   console.log("Altura:", datos.height * 10, "cm");
   console.log("Peso:", datos.weight / 10, "kg");
   
   console.log("--- Estadísticas ---");
   for (let s of datos.stats) {
    console.log("  " + s.stat.name + ":", s.base_stat);
   }
  
   console.log("--- Habilidades ---");
   for (let a of datos.abilities) {
    let nombreHabilidad = a.ability.name;
    if (a.is_hidden) {
      nombreHabilidad += " (oculta)";
    }
    console.log("  - " + nombreHabilidad);
   }
   console.log("-------------------------------------\n");
}
function obtenerStat(datos, nombreStat) {
  for (let s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat;
    }
  }
  return null; 
}

async function compararPokemon(nombre1, nombre2, stat) {
  console.log("Comparando", nombre1, "vs", nombre2, "en [", stat, "]...");
  
  const poke1 = await buscarPokemon(nombre1);
  const poke2 = await buscarPokemon(nombre2);

  if (!poke1 || !poke2) {
    console.log("No se pudo comparar. Uno de los Pokémon no existe.");
    return;
  }

  const valor1 = obtenerStat(poke1, stat);
  const valor2 = obtenerStat(poke2, stat);

  if (valor1 === null || valor2 === null) {
    console.log(" La stat no existe. Intenta con: hp, attack, defense, speed...");
    return;
  }

  console.log(poke1.name + ":", valor1);
  console.log(poke2.name + ":", valor2);

  if (valor1 > valor2) {
    console.log(" ¡GANA " + poke1.name.toUpperCase() + "!");
  } else if (valor2 > valor1) {
    console.log(" ¡GANA " + poke2.name.toUpperCase() + "!");
  } else {
    console.log(" ¡Empate!");
  }
}
async function pokemonMasFuerte(listaNombres, stat) {
  let mejorNombre = "";
  let mejorValor = -1;

  for (let nombre of listaNombres) {
    const datos = await buscarPokemon(nombre);
    if (!datos) continue; // Si hay error con este Pokémon, salta al siguiente

    const valorActual = obtenerStat(datos, stat);
    if (valorActual === null) continue;

    if (valorActual > mejorValor) {
      mejorValor = valorActual;
      mejorNombre = datos.name;
    }
  }

  console.log("\n El más fuerte en " + stat + " es: " + mejorNombre.toUpperCase() + " (" + mejorValor + ")");
  return mejorNombre;
}

async function iniciarPrograma() {
  
  console.log("--- 1. MOSTRAR FICHA ---");
  let nombreFicha = prompt("Escribe el nombre de un Pokémon para ver su ficha: ").toLowerCase();
  let datosFicha = await buscarPokemon(nombreFicha);
  mostrarFicha(datosFicha);

  
  console.log("\n--- 2. COMPARAR DOS POKÉMON ---");
  let luchador1 = prompt("Primer Pokémon: ").toLowerCase();
  let luchador2 = prompt("Segundo Pokémon: ").toLowerCase();
  let statBatalla = prompt("¿En qué stat competirán? (ej. attack, speed): ").toLowerCase();
  await compararPokemon(luchador1, luchador2, statBatalla);

  
  console.log("\n--- 3. BUSCAR EL MÁS FUERTE DEL EQUIPO ---");
  let equipo = [];
  console.log("Armemos un equipo de 3 Pokémon.");
  for (let i = 0; i < 3; i++) {
    let miembro = prompt(`Ingresa el Pokémon ${i + 1}: `).toLowerCase();
    equipo.push(miembro);
  }
  
  let statEquipo = prompt("¿Qué stat quieres evaluar en tu equipo? (ej. hp): ").toLowerCase();
  let ganadorEquipo = await pokemonMasFuerte(equipo, statEquipo);
  
  console.log("Mostrando ficha del ganador...");
  let datosGanador = await buscarPokemon(ganadorEquipo);
  mostrarFicha(datosGanador);
}

iniciarPrograma();  