type Receita = {
  Author: string;
  Description: string;
  Ingredients: string[];
  Method: string[];
  Name: string;
  url: string;
  urlImage: string;
}



const rootElement = document.querySelector(".root-card");
const searchButtonElement = document.querySelector("#search-button");
const searchInputElement = document.querySelector(".input-pesquisar");
const modalElement = document.querySelector("#myModal");

async function retornaReceita(): Promise<Receita[]>{
  try{
    const url = await fetch('https://receitas-server.vercel.app/api');
    const response = await url.json();
    return response;
  }
  catch(error){
    const emptyReturn= [] as Receita[];
    return emptyReturn;
    
  }

}

function arrayFiltro(arrayIngredientes: string){
  return arrayIngredientes.split(","); //vírgula é o parâmetro de divisão do array
}

async function filtroIngredientes(event: MouseEvent){

  const ingredienteFiltrado = await retornaReceita();
  const searchInputValue = (searchInputElement as HTMLInputElement).value;
  const filtro = ingredienteFiltrado.filter(dados => {
    const variosIngredientes = arrayFiltro(searchInputValue).length > 1;
    
    if(!variosIngredientes){
      const incluiIngredientes = dados.Ingredients.filter((ingredientesFiltrados) => {
        return ingredientesFiltrados.toLowerCase().includes(searchInputValue.toLowerCase()); 
      });
      return incluiIngredientes.length ? dados :false;
    }
    if(variosIngredientes){
      let acumulador: string[] = [];
      const procuraValor = arrayFiltro(searchInputValue);

      for(let i = 0; i < procuraValor.length; i++){
        for(let y = 0; y < dados.Ingredients.length; y++){
          if(dados.Ingredients[y].includes(procuraValor[i])){
            if(acumulador.includes(procuraValor[i])){
              return false;
            }
            acumulador.push(procuraValor[i]);
          }
        }
      }
      if(acumulador.length === procuraValor.length)return true;
    }
  });
  montaCards(filtro);
}


function eventListenerHandle(){
  (searchButtonElement as HTMLButtonElement)?.addEventListener("click", filtroIngredientes);
}

function modalInfo(){
  const infoButtonElement = document.querySelector("#modalbutton");
  (infoButtonElement as HTMLButtonElement).addEventListener("click", modalRender);
}

function modalRender(event: MouseEvent){
  const author = (event.target as HTMLButtonElement).dataset.author as unknown as Receita;
  const description = (event.target as HTMLButtonElement).dataset.description as unknown as Receita;
  const ingredients = (event.target as HTMLButtonElement).dataset.ingredients as unknown as Receita;
  const method = (event.target as HTMLButtonElement).dataset.method as unknown as Receita;
  const url = (event.target as HTMLButtonElement).dataset.url as unknown as Receita;
  const name = (event.target as HTMLButtonElement).dataset.name as unknown as Receita;
  
  if(modalElement){
    modalElement.innerHTML += 
    
    `<div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-author">${author}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h4>${name}</h4>
          <p>${description}</p>
          <p>${ingredients}</p>
          <p>${method}</p>
          <a>${url}</a>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>`;
  }
}

function montaCards(itens: Receita[]){
  if(rootElement){
    rootElement.innerHTML = "";
    var i =0;

    itens.forEach((item) => {
      if(i<20){
  
      rootElement.innerHTML +=
  `<div class="col-xl-4 col-md-6 col-12">
  <div class="chef-item-${item.Name}">
      <div class="chef-inner">
          <div class="chef-thumb"><img src="${item.urlImage}" alt="food-chef"></div>
          <div class="chef-content">
              <h5><a href="">${item.Name}</a></h5>
              <p>${item.Author}</p>
              <div class="scocial-share"><button id="modalbutton" data-author=${JSON.stringify(item.Author)} data-description=${JSON.stringify(item.Description)} data-name=${JSON.stringify(item.Name)} data-ingredients=${JSON.stringify(item.Ingredients)} data-method=${JSON.stringify(item.Method)} data-url=${JSON.stringify(item.url)} 
               class="food-btn"><span><i class="icofont-ui-user"></i>ver mais</span></button></div>
          </div>
      </div>
  </div>
</div>`
i++;
}});
modalInfo();
}
}

// `<div class="modal-content">
// <span class="close">&times;</span>
// <p>Some text in the Modal..</p>
// </div>`


// function itensPaginacao(valor){
//   if(paginationElement){
//     paginationElement = "";

//     paginationElement += `<div class="pagination">
//     <a href="#">&laquo;</a>
//     <a href="#">1</a>
//     <a href="#">2</a>
//     <a href="#">3</a>
//     <a href="#">4</a>
//     <a href="#">5</a>
//     <a href="#">6</a>
//     <a href="#">&raquo;</a>
//     </div>`;
//   }
// }
 

// listItems( next, 1, 6);

// console.log(" Array Next", next)


retornaReceita();
eventListenerHandle();
