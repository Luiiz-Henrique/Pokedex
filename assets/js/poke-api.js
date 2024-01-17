const pokeApi = {}

function convertPokeApiDetailToPokemon (pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    const stats = pokeDetail.stats.map((baseStats) => {
        return {
            name: baseStats.stat.name,
            value: baseStats.base_stat,
        }
    })

    pokemon.stats = stats

    const typesWeakness = pokeDetail

    pokemon.weakness = typesWeakness

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonNumber = (number) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${number}`)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json() )
        .then((JsonBody) => JsonBody.results )
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((requestDetails) => Promise.all(requestDetails))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getWeaknessPokemon = (typeName) => {
    const url = `https://pokeapi.co/api/v2/type/${typeName}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.damage_relations)
}