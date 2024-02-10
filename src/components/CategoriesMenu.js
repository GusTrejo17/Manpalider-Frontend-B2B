import React, { Component } from 'react';
import { connect } from "react-redux";
import { config, DISPATCH_ID } from '../libs/utils/Const';
import ReactDOM from 'react-dom';
import './MenuNavbar.css';

class CategoriesMenu extends Component {
    // Función para buscar artículos con las categorías especificadas
    subCategorySearch = async (valor, subC1 = '',subC2 = '',subC3 = '') => {
        const { setItemsFilters,setIdCategory, setLocation, itemsReducer: { searchByCategories }, setNextPage,setSearchCategoryObj } = this.props;
        setIdCategory(valor);
        setNextPage(0);
        setItemsFilters({});
        setLocation('menuCategories')
        let search = {
            category:valor,
            subC1,
            subC2,
            subC3
        }
        await setSearchCategoryObj(search)
        searchByCategories(search, 0, '', '');
    };

    // Región para pintar las subcategories (Nivel 1)
    renderSubCategories1 = (category, index1) => {
        const {itemsReducer: {category2}} = this.props;
        // Se buscan los elementos HTML de la categoría padre
        const dropdownIcon = document.getElementById('dropIcon' + index1);
        const divSSubCat = document.getElementById('subCat1-' + index1);
        const divSSubCat2 = category?.subC1.map((subCategory, index2) => { 
            let subCategory2 = category2.find(cat => cat.category === category.category && cat.Subcategory1 === subCategory.U_Subcategoria1)
            if(subCategory2?.subC2.length > 0) {
                return (<>
                    <div class="row p-0">
                        <div class="col-9 pr-0">
                            <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.category, subCategory.U_Subcategoria1)}>{subCategory.U_Subcategoria1}</span>
                        </div>
                        <div class="col-3 text-right" onClick={() => this.renderSubCategories2(category, subCategory2, index1, index2)} >
                            <img id={"dropIcon" + index1 + "-" + index2} src={config.navBar.blackDropdownMore} style={{ width: "15px", cursor: "pointer" }}/>
                        </div>
                    </div>
                    <hr />
                    <div class="pl-3" id={"subCat1-"+ index1 + "-" + index2} style={{display:'none'}}></div>
                </>)
            } else {
                return (<>
                    <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.category, subCategory.U_Subcategoria1)}>{subCategory.U_Subcategoria1}</span><hr />
                </>)
            }
        });
        ReactDOM.render(divSSubCat2, divSSubCat);
        // Dependiendo el estado anterior se abre o se cierra la sub-categoría
        if (divSSubCat.style.display === 'none') { 
            divSSubCat.style.display = "block";
            dropdownIcon.src = config.navBar.blackDropdownHide;
        } else {
            divSSubCat.style.display = "none";
            dropdownIcon.src = config.navBar.blackDropdownMore;
        }
    }

    // Región para pintar las subcategories (Nivel 2)
    renderSubCategories2 = (category, subCategory, index1, index2) => {
        const {itemsReducer: {category3}} = this.props;
        // Se buscan los elementos HTML de la categoría padre
        const dropdownIcon = document.getElementById('dropIcon' + index1 + "-" + index2);
        const divSubCat = document.getElementById('subCat1-'+ index1 + "-" + index2);
        const divSubCat2 = subCategory?.subC2.map((subCategory2, index3) => { 
            let subCategory3 = category3.find(cat => cat.category === category.category && cat.Subcategory1 === subCategory.Subcategory1 && subCategory2.U_Subcategoria2 === cat.Subcategory2)
            if(subCategory3?.subC3.length > 0) {
                return (<>
                    <div class="row p-0">
                        <div class="col-9 pr-0">
                            <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.category, subCategory.Subcategory1, subCategory2.U_Subcategoria2)}>{subCategory2.U_Subcategoria2}</span>
                        </div>
                        <div class="col-3 text-right" onClick={() => this.renderSubCategories3(category, subCategory, subCategory2, subCategory3, index1, index2, index3)} >
                            <img id={"dropIcon" + index1 + "-" + index2 + "-" + index3} src={config.navBar.blackDropdownMore} style={{ width: "15px", cursor: "pointer" }}/>
                        </div>
                    </div>
                    <hr />
                    <div class="pl-3" id={"subCat1-"+ index1 + "-" + index2 + "-" + index3} style={{display:'none'}}></div>
                </>)
            } else {
                return (<>
                    <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.category, subCategory.Subcategory1, subCategory2.U_Subcategoria2)}>{subCategory2.U_Subcategoria2}</span><hr />
                </>)
            }
        });
        ReactDOM.render(divSubCat2, divSubCat);
        // Dependiendo el estado anterior se abre o se cierra la sub-categoría
        if (divSubCat.style.display === 'none') { 
            divSubCat.style.display = "block";
            dropdownIcon.src = config.navBar.blackDropdownHide;
        } else {
            divSubCat.style.display = "none";
            dropdownIcon.src = config.navBar.blackDropdownMore;
        }
    }    

    // Región para pintar las subcategories (Nivel 3)
    renderSubCategories3 = (category, subCategory1, subCategory2, subCategory3, index1, index2, index3) => {
        // Se buscan los elementos HTML de la categoría padre
        const dropdownIcon = document.getElementById('dropIcon' + index1 + "-" + index2 + "-" + index3);
        const divSubCat2 = document.getElementById('subCat1-'+ index1 + "-" + index2 + "-" + index3);
        const divSubCat3 = subCategory3?.subC3.map((subCategory) => {
            return (<>
            <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.category, subCategory1.Subcategory1, subCategory2.U_Subcategoria2, subCategory.U_Subcategoria3)}>{subCategory.U_Subcategoria3}</span><hr />
        </>)});
        ReactDOM.render(divSubCat3, divSubCat2);        
        // Dependiendo el estado anterior se abre o se cierra la sub-categoría
        if (divSubCat2.style.display === 'none') { 
            divSubCat2.style.display = "block";
            dropdownIcon.src = config.navBar.blackDropdownHide;
        } else {
            divSubCat2.style.display = "none";
            dropdownIcon.src = config.navBar.blackDropdownMore;
        }
    }

    // Pintar el menú de categorías
    render() {
        const { itemsReducer:{categories,category1} } = this.props;
        return (
        <div class="modal left fade" id={"offCanvasCategories"} tabindex="1" role="dialog" aria-labelledby="offcanvas" data-backdrop={"false"}>
            <div class="modal-dialog p-4" role="document" style={{ position: "fixed", background: 'white' ,margin: "auto", maxWidth: "300px", height: "100%", left: 0, marginLeft: "0px", boxShadow: "0 3px 6px 1px var(--ck-color-shadow-drop-active)", width: "100%" }}>
                <div class="modal-content" style={{ height: "100%", overflowY: "auto", paddingRight: "15px", border: 'none', borderRadius: 0 }}>
                    <div class="modal-header-close black-bar-header mt-2">
                        <div class="container-fluid p-0">
                            <div class="row p-0">
                                <div class="col-6">
                                    <p style={{fontWeight: 'bold', fontSize: '20px'}}>Categorías</p>
                                </div>
                                <div class="col-6 align-items-end">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        {categories?.map((category, index) => {
                            let subCategory1 = category1.find(cat => cat.category === category.U_Categoria)
                            if(subCategory1?.subC1?.length > 0){
                                return (<>
                                    <div class="row p-0">
                                        <div class="col-9 pr-0">
                                            <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.U_Categoria)}>{category.U_Categoria}</span> 
                                        </div>
                                        <div class="col-3 text-right" onClick={()=> this.renderSubCategories1(subCategory1,index)} >
                                            <img id={"dropIcon" + index} src={config.navBar.blackDropdownMore} style={{ width: "15px", cursor: "pointer" }}/>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="pl-3" id={"subCat1-"+index} style={{display: 'none'}}> </div>
                                </>
                                );
                            } else {
                                return (<>
                                    <span class="d-block" type="button" data-dismiss="modal" aria-label="Close" style={{cursor: 'pointer'}} onClick={() => this.subCategorySearch(category.U_Categoria)}>{category.U_Categoria}</span><hr />
                                </>
                                );
                            }
                        })}
                    </div>

                </div>
            </div>
        </div>);
   }
}

const mapStateToProps = store => {
   return {
      itemsReducer: store.ItemsReducer,
      sessionReducer: store.SessionReducer,
      configReducer: store.ConfigReducer,
      shoppingCartReducer: store.ShoppingCartReducer,
      notificationReducer: store.NotificationReducer,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      enableSpinner: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_SPINNER, value }),
      setItemsSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_ITEMS, value }),
      setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
      setItemsFilters: value => dispatch({type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value}), 
      setRole: value => dispatch({ type: DISPATCH_ID.SESSION_SET_ROLE, value }),
      addNotificationReference: value => dispatch({ type: DISPATCH_ID.NOTIFICATION_SET_ALERT_REFERENCE, value }),
      setBusiness: value => dispatch({ type: DISPATCH_ID.SESSION_SET_BUSINESS_ID, value }),
      setToken: value => dispatch({ type: DISPATCH_ID.SESSION_SET_TOKEN, value }),
      setUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_USER, value }),
      setRememberUser: value => dispatch({ type: DISPATCH_ID.SESSION_SET_REMEMBER_USER, value }),
      setLogOutReference: value => dispatch({ type: DISPATCH_ID.CONFIG_SET_LOG_OUT_REFERENCE, value }),
      setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
      setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
      setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
      setSearchCategoryObj: value => dispatch({ type: DISPATCH_ID.ITEMS_CATEGORY_SEARCH, value }),
   };
};

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(CategoriesMenu);