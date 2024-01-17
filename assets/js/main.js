
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
                        ${descriptionPokemon(pokemon.number)}
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
                        <weakness-pokemon type="${pokemon.type}"></weakness-pokemon>
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


class WeaknessPokemon extends HTMLElement {
    constructor () {
        super()

        //const shadow = this.attachShadow({mode: "open"})
        const weaknessInfos = document.querySelector(".weaknessInfos")

        pokeApi.getWeaknessPokemon(this.getAttribute('type'))
            .then((response) => {
                response.double_damage_from.map((typeWeakness) => {
                    const weakness = document.createElement('li')
                    weakness.className = `type ${typeWeakness.name}`
                    weakness.textContent = typeWeakness.name

                    weaknessInfos.appendChild(weakness)
                })
            })
    }
}
customElements.define('weakness-pokemon', WeaknessPokemon)


function descriptionPokemon(numberPokemon) {
    return pokeApi.getDescriptionPokemon(numberPokemon)
        .then((response) => {
            const aboutInfos = document.querySelector(".aboutInfos")
            aboutInfos.textContent = response[9].flavor_text
        })
}


function closePopup9() { 
    popupCharacteristics.style.display = 'none'
}


