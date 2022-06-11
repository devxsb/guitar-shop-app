const StorageController = (() => {
    return {
        storeProduct: (product) => {
            let products;
            if (localStorage.getItem('product') === null) {
                products = [];
                products.push(product);
            }
            else {
                products = JSON.parse(localStorage.getItem('product'));
                products.push(product);
            }
            localStorage.setItem('product', JSON.stringify(products));
        },
        getProduct: () => {
            let products;
            if (localStorage.getItem('product') === null) {
                products = [];
            }
            else {
                products = JSON.parse(localStorage.getItem('product'));
            }
            return products;
        },
        updateProduct: (product) => {
            let products = JSON.parse(localStorage.getItem('product'));
            products.forEach((prd, index) => {
                if (prd.id == product.id) {
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem('product', JSON.stringify(products));
        },
        deleteStorage: (product) => {
            let products = JSON.parse(localStorage.getItem('product'));
            products.forEach((prd, index) => {
                if (prd.id == product.id) {
                    products.splice(index, 1);
                }
            });
            localStorage.setItem('product', JSON.stringify(products));
        },
        updateStorage: () => {
            let i = 1;
            let products = JSON.parse(localStorage.getItem('product'));
            products.forEach((prd) => {
                prd.id = i++;
            });
            localStorage.setItem('product', JSON.stringify(products));
        }
    }
})();
const ProductController = (() => {
    class product {
        constructor(id, name, price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }
    const data = {
        products: StorageController.getProduct(),
        selectedProduct: null,
        totalPrice: 0
    }
    return {
        getProducts: () => {
            return data.products;
        },
        getData: () => {
            return data;;
        },
        getTotal: () => {
            let total = 0;
            data.products.forEach(item => {
                total += item.price;
            });
            data.totalPrice = total;
            return total;
        },
        getProductById: (id) => {
            let product = null;
            data.products.forEach(prd => {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        addProduct: (name, price) => {
            let id;
            if (data.products.length > 0) {
                id = data.products.length + 1;
            } else {
                id = 1;
            }
            const newProduct = new product(id, name, price);
            data.products.push(newProduct);
            return newProduct;
        },
        setCurrentProduct: (product) => {
            data.selectedProduct = product;
        },
        getCurrentProduct: () => {
            return data.selectedProduct;
        },
        updateProduct: (name, price) => {
            let product = null;
            data.products.forEach(item => {
                if (item.id == data.selectedProduct.id) {
                    item.name = name;
                    item.price = parseFloat(price);
                    product = item;
                }
            })
            return product;
        },
        deleteProduct: () => {
            const product = data.selectedProduct;
            data.products.forEach((prd, index) => {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            })
            let i = 1;
            data.products.forEach((prd) => {
                prd.id = i++;
            })
        },
        updateProductId: () => {
            let i = 1;
            data.products.forEach((prd) => {
                prd.id = i++;
            })
        }
    }
})();

const UIContoller = (() => {
    return {
        createProductList: (products) => {
            let html = '';
            products.forEach(prd => {
                html += ` 
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                        <i class="far fa-edit change"></i>
                </td>
              </tr>
                `;
            });
            document.querySelector('#item-list').innerHTML = html;
        },
        addProduct: (prd) => {
            document.querySelector('#card').style.display = 'block';
            var item = `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                        <i class="far fa-edit change"></i>
                </td>
              </tr>
            `;
            document.querySelector('#item-list').innerHTML += item;

        },
        addProductToForm: () => {
            const product = ProductController.getCurrentProduct();
            document.querySelector('#prdName').value = product.name;
            document.querySelector('#prdPrice').value = product.price;
        },
        updateToForm: (item) => {
            let updatedItem = null;
            let items = document.querySelectorAll('#item-list tr');
            items.forEach(prd => {
                if (prd.classList.contains('bg-warning')) {
                    prd.children[1].textContent = item.name;
                    prd.children[2].textContent = item.price + ' $';
                    updatedItem = prd;
                }
            })
            return updatedItem;
        },
        showTotal: (total) => {
            document.querySelector('#dolar').textContent = total + ' $';
            document.querySelector('#tl').textContent = total * 17 + ' TL';
        },
        addingState: (prd) => {
            UIContoller.clearInputs();
            UIContoller.clearWarnings();

            document.querySelector('#addBtn').style.display = 'inline';
            document.querySelector('#editBtn').style.display = 'none';
            document.querySelector('#deleteBtn').style.display = 'none';
            document.querySelector('#cancelBtn').style.display = 'none';
        },
        editState: (tr) => {
            UIContoller.clearWarnings();
            tr.classList.add('bg-warning');
            document.querySelector('#addBtn').style.display = 'none';
            document.querySelector('#editBtn').style.display = 'inline';
            document.querySelector('#deleteBtn').style.display = 'inline';
            document.querySelector('#cancelBtn').style.display = 'inline';
        },
        deleteUI: () => {
            let items = document.querySelectorAll('#item-list tr');
            items.forEach((prd) => {
                if (prd.classList.contains('bg-warning')) {
                    prd.remove();
                }
            })
        },
        clearInputs: () => {
            document.querySelector('#prdName').value = '';
            document.querySelector('#prdPrice').value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll('#item-list tr');
            items.forEach((item) => {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },
        hideCard: () => {
            document.querySelector('#card').style.display = 'none';
        }
    }
})();
const appController = ((ProductCtrl, UICtrl, StorageCtrl) => {
    const loadEventListeners = () => {
        UICtrl.addingState();
        UICtrl.showTotal(ProductCtrl.getTotal());
        document.querySelector('#addBtn').addEventListener('click', productAddSubmit);
        document.querySelector('#item-list').addEventListener('click', productEditSubmit);
        document.querySelector('#editBtn').addEventListener('click', productSaveChangesSubmit);
        document.querySelector('#cancelBtn').addEventListener('click', editCancelClick);
        document.querySelector('#deleteBtn').addEventListener('click', deleteClick);

    }
    const productAddSubmit = (e) => {
        e.preventDefault();
        const name = document.querySelector('#prdName').value;
        const price = document.querySelector('#prdPrice').value;
        if (name !== '' && price !== '') {
            const newPrd = ProductCtrl.addProduct(name, parseFloat(price));
            UICtrl.addProduct(newPrd);
            StorageCtrl.storeProduct(newPrd);
            UICtrl.showTotal(ProductCtrl.getTotal());
            UICtrl.clearInputs();
        }
    }
    const productEditSubmit = (e) => {
        if (e.target.classList.contains('change')) {
            const id = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const product = ProductCtrl.getProductById(id);
            ProductCtrl.setCurrentProduct(product);
            UICtrl.addProductToForm();
            UICtrl.editState(e.target.parentNode.parentNode);
        }
    }
    const productSaveChangesSubmit = (e) => {
        const name = document.querySelector('#prdName').value;
        const price = document.querySelector('#prdPrice').value;
        if (name !== '' && price !== '') {
            const updatedProduct = ProductCtrl.updateProduct(name, price);
            let product = UICtrl.updateToForm(updatedProduct);
            StorageCtrl.updateProduct(updatedProduct);
            UICtrl.addingState();
            UICtrl.showTotal(ProductCtrl.getTotal());
        }
        e.preventDefault();
    }
    const editCancelClick = (e) => {
        UICtrl.addingState();
        e.preventDefault();
    }
    const deleteClick = (e) => {
        const product = ProductCtrl.getCurrentProduct();
        ProductCtrl.deleteProduct();
        ProductCtrl.updateProductId();
        UICtrl.deleteUI();
        StorageCtrl.deleteStorage(product);
        StorageCtrl.updateStorage();
        UICtrl.createProductList(ProductCtrl.getProducts());
        UICtrl.showTotal(ProductCtrl.getTotal());
        UICtrl.addingState();
        if (ProductCtrl.getProducts().length == 0) {
            UICtrl.hideCard();
        }
        e.preventDefault();
    }

    return {
        init: () => {
            console.log("starting app...");
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            loadEventListeners();
        }
    }
})(ProductController, UIContoller, StorageController);
appController.init();