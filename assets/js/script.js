
const URL = "https://apirest-iproject.herokuapp.com/"
const API = "api/"
const IMAGE = "images/"
const COUNTRIES = "countries"
const CITIES = "cities/"
const PRODUCTS = "products"
var dataProducts = []

//load ready
$(document).ready(function() {
    init()
})

//Init main
function init() {
    initCombobox() 
    initDatagrid()
    initElement()
}

//Init combobox country
function initCombobox() {
    loadComboCountry()
}

//Load Combobox with data Country
function loadComboCountry() {
    let url = URL + API + COUNTRIES
    $('#cb_country').combobox({
        method: 'GET',
        url: url,
        valueField: 'id',
        textField: 'name',
        onChange: function(idCountry){
            loadComboCity(idCountry)
        }
    })
}

//Load Combobox with data City in cascada
function loadComboCity(idCountry) {
    let url = URL + API + CITIES + idCountry
    if(idCountry != "") {
        $('#cb_city').combobox({
            method: 'GET',
            url: url,
            valueField: 'id',
            textField: 'name'
        })
    }
}

//Setup datagrid product
function initDatagrid() {
    loadDataGridProduct()
}

//Config datagrid product
function loadDataGridProduct() {
    let url = URL + API + PRODUCTS
    loadDataProducts(url)
    getDataApiRestProduct(url)
}

//Load data product in datagrid
function loadDataProducts(url) {
    let dg = $('#dg_product')
    dg.datagrid({
        method: "GET",
        title: "Listado de Productos",
        width: 850,
        height: 350,
        url: url,
        columns: [configColumnsDatagrid()]
    })
}

//Config columns datagrid product
function configColumnsDatagrid() {
    return [
            {field: 'ck', checkbox: "true"},
            {field: 'name', title: 'Accesorio', width: 400},
            {
                field: 'price', title: 'Precio', width: 100,
                formatter: function (value, row, index) {
                    return value + " $us"
                }
            },
            {
                field: 'stock', title: 'Stock', width: 100,
                formatter: function (value, row, index) {
                    return value + " Unidades"
                }
            },
            {field: 'brand', title: 'Marca', width: 100},
            {
                field: 'image', title: 'Imagen',
                formatter: function (value, row, index) {
                    return `<img src="${URL + IMAGE + value}" width="80" />`
                }
            } 
        ]
}

//Request api products
function getDataApiRestProduct(url) {
    $.ajax({
        url: url
    }).fail(function() {
        alert("Por favor revisar su conexion a Internet :(")
    }).done(function (data){
        validDataRepit(data)
    })
}

//Valid data repit of products for filter
function validDataRepit(data) {
    $.each(data, function(index, product) {
        let item = {}
        item.value = product.brand
        item.text = product.brand
        loadDataProductNoRepit(item)
    })
    addItemStatic()
}

//load data of prodct not repit
function loadDataProductNoRepit(item) {
    if(dataProducts.length > 0) {
        if(existElement(item)) {
            dataProducts.push(item)
        }
    } else {
        dataProducts.push(item)        
    }
}

//return bool exist element product
function existElement(item) {
    let sw = true
    $.each(dataProducts, function(i, p) {
        if(p.text === item.text) {
            sw = false
        }
    })
    return sw
}

//Add option static all for filter
function addItemStatic() {
    let item = {value: '', text: 'All'}
    dataProducts.push(item)
    configFilterDatagridProduct()
}

//Setup filter datagrid
function configFilterDatagridProduct() {
    let dg = $('#dg_product')
    dg.datagrid('enableFilter', [{
        field: 'brand',
        type: 'combobox',
        options: configOptionsDatagrid(dg) 
    }])
}

//Config attr options datagrid filter
function configOptionsDatagrid(dg) {
   return {
            panelHeight: 'auto',
            data: dataProducts,
            onChange: function(value) {
                eventOnChangeDatagridFilter(value, dg)
            }
        }
}

//Event change datagrid filter
function eventOnChangeDatagridFilter(value, dg) {
    if(value == ''){
        dg.datagrid('removeFilterRule', 'brand')
    } else {
        dg.datagrid('addFilterRule', {
            field: 'brand',
            op: 'equal',
            value: value
        })
    }
    dg.datagrid('doFilter')
}

//Init setup components form
function initElement() {
    configElementsTextbox()
}

//Config components attr,valid
function configElementsTextbox() {
    configtextbox('#txt_name')
    configtextbox('#txt_birthdate')
    configtextbox('#txt_email')
    configtextbox('#txt_password')
    configtextbox('#txt_vpassword')
    configtextbox('#txt_weight')
}

//Config attr components form
function configtextbox(element) {
    $(element).textbox({
        width: '100%',
        height: 40,
        padding: 10,
        required: true
    })
}

//Event click btn open product
$('#btn_open_product').click(function() {
    getSelectionProducts()
})

//Setup selection of products datagrid
function getSelectionProducts() {
    cleanDialog()
    let products = $('#dg_product').datagrid('getSelections');
    showDialogProduct()
    if (products.length > 0) {
        configAddProducts(products)    
    } else {
        $('#d_product').append("<h1 style='text-align: center;'>No se han seleccionado Productos</h1>")
    }
}

//Clean dialog product
function cleanDialog() {
    $('#d_product').empty()
}

//Config show dialog product
function showDialogProduct() {
    $('#d_product').dialog({
        title: 'Productos Seleccionados',
        width: 400,
        height: 280,
        closed: false,
        cache: false,
        modal: true
    })
}

//Config Add product dialog
function configAddProducts(products) {
    let template = `<div class="card">
                        <img src="${URL + IMAGE}#image" style="width:40%;">
                        <div class="container">
                            <p><b>Producto: </b>#name</p> 
                            <p><b>Marca: </b>#brand</p> 
                            <p><b>Precio: </b>#price $us</p>
                        </div>
                    </div>`
    addProductDialog(products, template)
}

//Add products to dialog
function addProductDialog(products, template) {
    $.each(products, function(i, p) {
        let template_aux = template.replace("#name", p.name).replace("#image", p.image).replace("#brand", p.brand).replace("#price", p.price)
        $('#d_product').append(template_aux)
    })
}

//Config attr panel register user 
$('#p_register').panel({
    title: 'Formulario de Registro',
    width: 400
})

//Config attr input text weight
$('#txt_weight').numberbox({
    min: 0,
    precision: 2,
    decimalSeparator: ','
})

//Config datebox retriction date > 01/01/1999
$('#txt_birthdate').datebox().datebox('calendar').calendar({
    validator: function(date) {
        let dateRestrict = new Date(1999, 0, 1)
        return date > dateRestrict
    }
})

//Config txt birthdate formatter and parser
$('#txt_birthdate').datebox({
    formatter: function(date) {
        return getFormatDate(date)
    },
    parser: function(s){
        if (!s) 
            return new Date()
        return getParserDate(s)
    }
})

//return new formmat date
function getFormatDate(date) {
    let y = date.getFullYear()
    let m = date.getMonth()+1
    let d = date.getDate()
    return (d < 10 ? ('0' + d) : d) + '/' + (m < 10 ? ('0' + m) : m) + '/' + y
}

//return date valid parser
function getParserDate(s) {
    let ss = (s.split('/'))
    let y = parseInt(ss[0],10)
    let m = parseInt(ss[1],10)
    let d = parseInt(ss[2],10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(d,m-1,y)
    } else {
        return new Date()
    }
}

//Add new rules for validatebox
$.extend($.fn.validatebox.defaults.rules, {
    equals: {
        validator: function(value, param){
            return value == $(param[0]).val()
        },
        message: 'Field do not match.'
    },
    formatDate: {
        validator: function(value) {
            return validateFormatDate(value)
        },
        message: 'Incorrect date.'
    }
})

//Validacion de formato de fecha
function validateFormatDate(date) {
    let RegExPattern = /^\d{2}\/\d{2}\/\d{4}$/
    return ((date.match(RegExPattern)) && (date!=''))
}


