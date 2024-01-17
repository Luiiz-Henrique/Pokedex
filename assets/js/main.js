
const pokemonList = document.getElementById("pokemonList")
const loadMoreButton = document.getElementById("loadMoreButton")
const popupCharacteristics = document.getElementById("popupCharacteristics")

const maxRecords = 151
const limit = 10
let offset = 0


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map((pokemon) => `

            <li id="${pokemon.number} "type="button" class="pokemon ${pokemon.type}"> 
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span> 

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}"> ${type} </li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>`

        ).join('')
    })
}

loadPokemonItens(offset, limit)

function openPopup (pokemon) {
    popupCharacteristics.style.display = 'block'
    popupCharacteristics.innerHTML = `
        <div class="content-popupCharacteristics">

            <div class="pokemonDetail pokemon ${pokemon.type}">
                <!-- Pokemon Here -->
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span> 

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}"> ${type} </li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </div>

            <div class="pokemonStates">
                <div class="contentInfos">

                    <h4>Sobre</h4>

                    <p class="aboutInfos">
                        It can freely recombine its own cellular structure to transform into other life-forms.
                    </p>

                    <h4>Estatísticas</h4>

                    <ul class="statisticsInfos">
                        ${pokemon.stats.map((stat) => `
                            <li>
                                <strong>${stat.name}</strong>
                                <span>${stat.value}</span>
                            </li>`
                            ).join('')}
                    </ul>

                    <h4>Fragilidade</h4>

                    <ul class="weaknessInfos">
                        ${listTypesWeakness(pokemon.type).then((result) => console.log(result))}
                    </ul>
                    <!-- Infos Here -->
                </div>
            </div>
        </div>`
}

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {

        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)

    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', (event) => {
    const numberPokemon =event.target.closest('li').id
    pokeApi.getPokemonNumber(numberPokemon).then((response) => openPopup(response))
})

function listTypesWeakness(type){
    return pokeApi.getWeaknessPokemon(type)
        .then((response) => {
            response.double_damage_from.map((typeWeakness) => `
            <li>${typeWeakness.name}</li>`
            ).join('')
        })
}

function closePopup9() { 
    popupCharacteristics.style.display = 'none'
}