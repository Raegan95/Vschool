const getPokemon = () => {
    const baseURL = "https://api.vschool.io";
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            data.objects[0].pokemon.forEach((pokemon) => {
                getPokemonDetails(pokemon);
            });
        }
    };
    xhr.open("GET", `${baseURL}/pokemon`, true);
    xhr.send();
};

const getPokemonDetails = (pokemon) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            appendToDOM(data);
        }
    };
    const baseURL = "https://pokeapi.co";
    let resource = pokemon.resource_uri.replace(/(?<=v)1/g, "2");
    xhr.open("GET", `${baseURL}/${resource}`);
    xhr.send();
};

const appendToDOM = (pokemon) => {
    const name = document.createElement("h1");
    const height = document.createElement("p");
    const weight = document.createElement("p");
    const baseXP = document.createElement("p");
    const abilities = document.createElement("h3");
    const abilitiesList = document.createElement("ul");
    const types = document.createElement("h3");
    const typesList = document.createElement("ul");

    name.textContent = pokemon.species.name;
    height.textContent = `Height: ${pokemon.height}`;
    weight.textContent = `Weight: ${pokemon.weight}`;
    baseXP.textContent = `XP: ${pokemon.base_experience}`;
    abilities.textContent = "Abilities";
    types.textContent = "Types";

    pokemon.abilities.forEach(({ ability }) => {
        const abilityEl = document.createElement("li");
        abilityEl.textContent = ability.name;
        abilitiesList.appendChild(abilityEl);
    });

    pokemon.types.forEach(({ type }) => {
        const typeEl = document.createElement("li");
        typeEl.textContent = type.name;
        typesList.appendChild(typeEl);
    });

    const pokemonEl = document.createElement("div");
    pokemonEl.appendChild(name);
    pokemonEl.appendChild(height);
    pokemonEl.appendChild(weight);
    pokemonEl.appendChild(baseXP);
    pokemonEl.appendChild(abilities);
    pokemonEl.appendChild(abilitiesList);
    pokemonEl.appendChild(types);
    pokemonEl.appendChild(typesList);

    document.body.appendChild(pokemonEl);
};

getPokemon();