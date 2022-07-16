//-------------------------------------------------------------------D O M 
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productsCount = document.getElementById('productsCount');

const priceInputs = document.querySelectorAll('#priceContainer input');//all inputs related to price
const productPrice = document.getElementById('productPrice');
const productTaxes = document.getElementById('productTaxes');
const productADS = document.getElementById('productADS');
const productDiscount = document.getElementById('productDiscount');
const totalPriceElement = document.getElementById('totalPrice');


const btnCreate = document.getElementById('create');

const priceContainer = document.getElementById('priceContainer');
const tBody = document.getElementById('tbody');
const date = document.getElementById('date');//input:date
//-------------------------------------------------------------------
let totalPrice = 0;
let productItem = '';
let productList = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
// i want to set uniq num to every product (ID)
let id  =  localStorage.getItem('id') ?localStorage.getItem('id') : 0;
displayProducts(productList);
//------------------------------------------------------------------- CREAT 
btnCreate.onclick = (e)=>{
    e.preventDefault();
    createElements();
    
}
//onclick lets get all input value
function createElements() {

    //[1]make sure all required inputs have value
    if(!isEmpty()) {

        //[2]make sure totla price is ok
        if(!calcPrice()) {
            return;
        }

        
        //[3]get current date and save it as property to the product Obj to can filter them by date
        let fullDate = getCurrentDate();

        //[4]save the products 
        //[a] make obj using the inpute values
        let product = {
            name : productName.value,
            category: productCategory.value,
            price: productPrice.value,
            ads: productADS.value,
            taxes: productTaxes.value,
            discount: productDiscount.value,
            productTotalPrice: totalPrice,
            date:fullDate,

        }
        //[b]push the product to the list as much as the count is
        let addingTime = +productsCount.value <= 0 ? 1 : +productsCount.value;
        for (let i = 0; i < addingTime; i++) {
            product.productId = id;
            //---------------------------------------------------------------------IMPORTANT (when u change id value , u chang it in all object (refrance))
            //-------------- so make sure u have Deep copy 
            productList.push(Object.assign({}, product))  
            id++;      
        }
        
    
        //[c]save the list to local storage
        localStorage.setItem('products' , JSON.stringify(productList))
        localStorage.setItem('id' , id)

        //[5]lets clear all inputes
        setValueToInputs();

        //[6]lets display the list after this adding
        displayProducts(productList);
        doneMessage( btnCreate, 'Successed');
    }
    
}

//-- boolean (is empty)
function isEmpty(params) {
     //[1]make sure all inputes have value
    if(productName.value.length <= 0 || productCategory.value.length <= 0 ){
        //[2]create warnign eLement and display it
        //[a]remove last warning message if its exist
        if(document.getElementById('warningEmptyValueMessage'))
        {
            document.getElementById('warningEmptyValueMessage').remove()
        }
        //[b]check which inputs have the empty value to append the message after it
        if(productName.value.length <= 0) {
            myWarning = createWarningElement('Pls Enter The Name');
            productName.after(myWarning)
        }else {
            myWarning = createWarningElement('Pls Enter The Category'); 
            productCategory.after(myWarning);
        }
        //[c]assign id for it (so u can check if its exist or not)
        myWarning.id = 'warningEmptyValueMessage'
        
        //[d]return true
        return true;
    }
    //[3] else just clear all alert and return false
   if(document.getElementById('warningEmptyValueMessage'))
   {
       document.getElementById('warningEmptyValueMessage').remove()
   }
    return false;
}
//-- void (clear inputes) or (display product)
function setValueToInputs(product) {
    productName.value = product ? product.name : '';
    productCategory.value = product ? product.category : '';
    productPrice.value = product ? product.price : '';
    productTaxes.value = product ? product.taxes : '';
    productADS.value = product? product.ads:'';
    productDiscount.value = product ? product.discount : '';   
    productsCount.value = '';
    totalPriceElement.innerText = product ?  `totalPrice : ${product.productTotalPrice }`:"totalPrice : ";
    product ? totalPriceElement.classList.replace('bg-danger','bg-info') : totalPriceElement.classList.replace('bg-info','bg-danger');
}
//-- void displayProducts
function displayProducts(list) {

    let rowOfProducts = list.map((product,i)=>{
         return `<tr class="py-2">
         <td class="text-info">${i+1}</td>
         <td>${product.name}</td>
         <td>${product.productTotalPrice}</td>
         <td>${product.category}</td>
         <td><button class="btn btn-sm btn-info" data-update=${product.productId}>Update</button></td>
         <td><button class="btn btn-sm btn-danger" data-delet=${product.productId}>Delet</button></td>
         </tr>`
     }).join('')
     tBody.innerHTML = rowOfProducts;

   //--Creat input for search
   if(!document.getElementById('searchInput')) {
        let myInput = document.createElement('input');
        myInput.classList.add('form-control' , 'my-3');
        myInput.placeholder = "Search By Name ..."
        myInput.id = 'searchInput';
        document.getElementById('table').before(myInput)
    }
  

 
}
//-- return the current date in (yyy-mm-dd)
function getCurrentDate() {
    let d = new Date();
    return `${ d.getFullYear()}-${(d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1)}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`
}
//------------------------------------------------------------------- TOTAL PRICE
//oninput calc the product price
priceInputs.forEach((input)=>{
    input.addEventListener('input' , ()=>{
        calcPrice()
    })
})
//boolean (return true if it complete the processing)
function calcPrice() {
    //[1]if the price inpute have no value
    if(productPrice.value === '') {
        //[a]make totalPriceElement red (like its warning for user)
        totalPriceElement.classList.replace('bg-info' , 'bg-danger')
        //[b]creat alert and display it (but first make sure it is not already exist (like user click more than once))
        if(!document.getElementById('priceWarningMessage')){
            let warnignElement = createWarningElement("Pls enter price")
            warnignElement.id = 'priceWarningMessage';
            priceContainer.append(warnignElement);
        }   
        return false;
    }
    //[1]else;
    //[a]make totalPriceElement bg-info (like the wrong thing is gone)
    totalPriceElement.classList.replace('bg-danger' , 'bg-info')
    //[b]remove alert if it is exsit (maybe he wnter the value correctly at first time so there is no alert to remove it)
    if(document.getElementById('priceWarningMessage')){
        document.getElementById('priceWarningMessage').remove();
    }
    //[c]calc totalPrice
    totalPrice = (+productPrice.value) + (+productTaxes.value) + (+productADS.value) - productDiscount.value;
    //[d]display it in totalPriceElement
    totalPriceElement.innerText = `totalPrice : ${totalPrice}`
    return true;

}
//-------------------------------------------------------------------  CREATE (D O M )
//--warning message
function createWarningElement(message) {
    let warnignElement = document.createElement('p');
    let warningMessage = document.createTextNode(message);
    warnignElement.style.marginLeft = '12px'
    warnignElement.classList.add('bg-danger' , 'p-2' , 'mt-2' , 'rounded-pill')
    warnignElement.append(warningMessage);

    return warnignElement;
}
//--doneMessage
function doneMessage(appendAfter,message,callback) {
    let successedElement = document.createElement('p');
    let successedMessage = document.createTextNode(message);
    successedElement.style.marginLeft = '12px'
    successedElement.style.width = 'fit-content'
    successedElement.style.display = 'inline-block'
    successedElement.classList.add('bg-info' , 'p-2' , 'rounded-2' , 'm-0' , 'ms-2')
    successedElement.append(successedMessage);

    appendAfter.after(successedElement)
    setTimeout(()=>{
        successedElement.remove();
        callback ? callback() : "";
    },2000)

    
}
//------------------------------------------------------------------- DELET & UPDATE
document.body.onclick = (e)=>{
    if(e.target.dataset.delet){
        //do delet function
        deletProduct(e.target.dataset.delet)
    }

    if(e.target.dataset.update){
        //do update function
        updateProductUp(e.target.dataset.update)  
    }

    if(e.target == document.getElementById('btnUpdate')){       
        update(e , productItem)
    }
    document.getElementById('searchInput').oninput = (e)=>{
        searchByName(e.target.value);
    }
    
}
//-- delet function
//[1]find the proudct (searchById)
//[2]delet it from productList arr (splice)
//[3]delet it from local storge
//[4]re display the new list
function deletProduct(id) {
    productList.splice(searchById(id),1);
    localStorage.setItem('products' , JSON.stringify(productList));
    displayProducts(productList);
}
//[1]find the proudct (searchById)
//[2]display it to the user 
//[3]create UpdateButton
//[4]switch to Update mode (display none create element)
function updateProductUp(id) {
    productItem = productList[searchById(id)];
    setValueToInputs(productItem);


    let UpdateButton = document.createElement('button');
    UpdateButton.innerHTML = 'Update';
    UpdateButton.classList.add('btn', 'btn-lg', 'btn-primary');
    UpdateButton.id = 'btnUpdate'

    btnCreate.style.display= "none";
    if(!document.getElementById('btnUpdate')) {
        document.forms[0].append(UpdateButton);
    }
    
}
//[1]update the old values with the new ones (make sure u calc the price)
//[2]update the productList and local 
//[3]re display the new list 
//[4]switch to Create mode (display create btn block and remove update button) 
function update(target ,productItem) {
    let UpdateButton = document.getElementById('btnUpdate');
    target.preventDefault();
        if(calcPrice()) {
            productItem.name = productName.value;
            productItem.category= productCategory.value;
            productItem.price= productPrice.value;
            productItem.ads= productADS.value;
            productItem.taxes= productTaxes.value;
            productItem.discount= productDiscount.value;
            productItem.productTotalPrice = totalPrice;
    
            displayProducts(productList);
            localStorage.setItem('products' , JSON.stringify(productList));
            setValueToInputs();
            
            let remove = function(){
                UpdateButton.remove();
                btnCreate.style.display= "block";
            } 
            doneMessage(UpdateButton ,"Successed Update" , remove);
        }   
}
//--- serching by id
//return product index from the listProducts arr
function searchById(id){
    let product = productList.filter((e)=>{
            return e.productId == id;
    })
    return productList.indexOf(product[0]);
}
//------------------------------------------------------------------- SEARACH
function searchByName(name) {
    //[1]filter the productList with the name(Parameter) 
    let searchList = [...productList].filter((e)=>{
        return e.name.toLowerCase().includes(name.toLowerCase());
    });
    //[2]because its arr of object , every chang i will make in the searchList it will effect in th origin
    // so lets have deep copy
    let depCopyOfSearchList = [];
    for (let i = 0; i < searchList.length; i++) {
        depCopyOfSearchList[i] = Object.assign({} , searchList[i]);   
    }
    //[3]add some style to the name (Parameter) , 
    for (let i = 0; i < depCopyOfSearchList.length; i++) {
        depCopyOfSearchList[i].name = depCopyOfSearchList[i].name.replace(name , `<span class="text-black fw-bold">${name}</span>`)    
    }
    //[4]lets display the deep copy
    displayProducts(depCopyOfSearchList)

}
function searchByDate(date) {
    let searchList = [...productList].filter((e)=>{
        return e.date == date
    });

    displayProducts(searchList);
    
}
date.onchange = (e)=>{
    searchByDate(e.target.value)
}