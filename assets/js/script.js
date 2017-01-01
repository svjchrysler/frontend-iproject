
const URL = "https://apirest-iproject.herokuapp.com/api/"
var dataProducts = []

$(document).ready(function() {
    loadComboCountry()
    loadDataGridProduct()

    configElementsTextbox()
})

function configElementsTextbox() {
    configtextbox('#txt_name')
    configtextbox('#txt_birthdate')
    configtextbox('#txt_email')
    configtextbox('#txt_password')
    configtextbox('#txt_vpassword')
    configtextbox('#txt_weight')
}

function loadDataGridProduct() {
    let url = URL + "products"
    loadDataProducts(url)
    getDataApiRestProduct(url)
}

function getDataApiRestProduct(url) {
    $.ajax({
        url: url
    }).done(function (e){
        $.each(e, function(index, product) {
            let item = {}
            item.value = product.brand
            item.text = product.brand
            
            if(dataProducts.length > 0) {
                if(existElement(item)) {
                    dataProducts.push(item)
                }
            } else {
                dataProducts.push(item)        
            }      
        })

        let item = {value: '', text: 'All'}
        dataProducts.push(item)

        configFilterDatagridProduct()
    })
}

function existElement(item) {
    let sw = true
    $.each(dataProducts, function(i, p) {
        if(p.text === item.text) {
            sw = false
        }
    })
    return sw
}

function configFilterDatagridProduct() {
    let dg = $('#dg_product')
    dg.datagrid('enableFilter', [{
        field: 'brand',
        type: 'combobox',
        options: {
            panelHeight: 'auto',
            data:dataProducts,
            onChange:function(value) {
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
        }
    }])
}

function loadDataProducts(url) {
    let dg = $('#dg_product')
    dg.reload
    dg.datagrid({
        method: "GET",
        title: "Listado de Productos",
        width: 850,
        height: 350,
        url: url,
        columns: [[
            {field: 'ck', checkbox:"true"},
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
                    return `<img src="https://apirest-iproject.herokuapp.com/images/${value}" width="80" />`
                }
            } 
        ]]
    })
}

$('#btn_open_product').click(function() {
    getSelectionProducts()
})

function getSelectionProducts() {
    cleanDialog()
    let products = $('#dg_product').datagrid('getSelections');
    showDialogProduct()
    if (products.length > 0) {
        addProductsAdded(products)    
    } else {
        $('#d_product').append("<h1 style='text-align: center;'>No se han seleccionado Productos</h1>")
    }
}

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

function cleanDialog() {
    $('#d_product').empty()
}

function addProductsAdded(products) {
    let template = `<div class="card">
                        <img src="https://apirest-iproject.herokuapp.com/images/#image" style="width:40%;">
                        <div class="container">
                            <p><b>Producto: </b>#name</p> 
                            <p><b>Marca: </b>#brand</p> 
                            <p><b>Precio: </b>#price $us</p>
                        </div>
                    </div>`

    $.each(products, function(i, p) {
        let template_aux = template.replace("#name", p.name).replace("#image", p.image).replace("#brand", p.brand).replace("#price", p.price)
        $('#d_product').append(template_aux)
    })
}

//Load Combobox with data Country
function loadComboCountry() {
    let url = URL + "countries"
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
    let url = URL + "cities/" + idCountry
    if(idCountry != "") {
        $('#cb_city').combobox({
            method: 'GET',
            url: url,
            valueField: 'id',
            textField: 'name'
        })
    }
}

$('#p_register').panel({
    title: 'Formulario de Registro',
    width: 400
})

function configtextbox(element) {
    $(element).textbox({
        width: '100%',
        height: 40,
        padding: 10,
        required: true
    })
}

$.extend($.fn.validatebox.defaults.rules, {
    equals: {
        validator: function(value,param){
            return value == $(param[0]).val();
        },
        message: 'Field do not match.'
    }
});

$('#txt_weight').numberbox({
    min:0,
    precision:2,
    decimalSeparator: ','
})

function formatDate(date) {
    let y = date.getFullYear()
    let m = date.getMonth()+1
    let d = date.getDate()
    return d+'/'+m+'/'+y
}

function parserDate(s){
    if (!s) return new Date();
    var ss = (s.split('/'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}
/*$('#txt_birthdate').datebox({
    onSelect: function(date) {
        if(date.getFullYear() >= 1999 & date.getDate() > 1) {
            let format_date = "#d/#m/#y"
            let rest_date = format_date.replace("#d", date.getDate()).replace("#m", date.getMonth() + 1).replace("#y", date.getFullYear())
            //$(this).datebox('setValue', rest_date);
            console.log($(this))
            console.log($('#txt_birthdate'))
        } else {
            $('#txt_birthdate').datebox('setValue', '');
        }
    }
})*/
