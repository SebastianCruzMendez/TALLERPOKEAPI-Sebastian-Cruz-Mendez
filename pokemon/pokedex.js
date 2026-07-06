const prompt = require("prompt-sync")();
  async function pedirNombre(){
    //buscarPokemon(nombre);
    for (let i=0;i<3;i++){
      let nombre=prompt("Escribe Nombre: ").toLowerCase();
      await buscarPokemon(nombre);
    }
  }
    pedirNombre();

 

  async function buscarPokemon(nombre) {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/"+nombre);
    if (!respuesta.ok) {
      console.log("Error:",respuesta.status);
      return null;
    }
    const datos = await respuesta.json();
    console.log("Nombre:",datos.name.toUpperCase(),"ID:",datos.id);      
  }