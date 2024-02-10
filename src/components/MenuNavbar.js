import React, { Component } from 'react';
import { connect } from "react-redux";
import { config, ROLES, DISPATCH_ID } from '../libs/utils/Const';
import $ from "jquery";
import { ApiClient } from "../libs/apiClient/ApiClient";
import moment from 'moment';
import ReactDOM from 'react-dom';
import './MenuNavbar.css';

class MenuNavbar extends Component {

   // subCategorySearch1 = async (subCategory,page = 0)=>{
   //     const {itemsReducer,setIdCategory,setLocation,configReducer: { history }} = this.props;
   //     setIdCategory(null);
   //     setLocation('marcaOne');
   //     await itemsReducer.searchByKey('',0,'marcaOne', true);
   // }
    subCategorySearch = async (valor, subC1 = '',subC2 = '',subC3 = '') => {
      const { setItemsFilters,setIdCategory, setLocation, itemsReducer: { searchByCategories,searchCategoryObj }, setNextPage,setSearchCategoryObj } = this.props;
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
   //#region ############## REGION RENDER DE SUBCATEGORIAS (NIVEL 2) ##############
   renderSubCategories = (category1) => {
      const {itemsReducer:{category2}} = this.props
      let divSubCategories = document.getElementById('subMenuNivel1');
      let divSubCategories2 = document.getElementById('subMenuNivel2');  // Prueba
      if (category1?.subC1?.length > 0) {
         const listSubCategory = category1.subC1.map((subCategory) =>{
            let find = category2.find(cat2 => cat2.category === category1.category && cat2.subcategory === subCategory.U_Subcategoria1)
            if(!find){
               find = []
            }
            return(
               <div>
                  <span
                     className='nav-link'
                     style={{ fontSize: "0.9rem" }}
                     onClick={() => this.subCategorySearch(category1.category,subCategory.U_Subcategoria1)}
                     onMouseOver={() => this.renderSubCategories2(category1.category,find)}
                  >{subCategory.U_Subcategoria1}
                  </span>
                  <div class="dropdown-divider"></div>
               </div>

            );
           
            });
         
         //#region 
         ReactDOM.render(
            <span>
               <span style={{ textAlign: "center", fontSize: "0.9rem" }}>Subcategorias de {category1.category}</span>
               <br /><br />
               <div className='designScroll' style={{ maxHeight: 305 }}>
                  {listSubCategory}
               </div>
            </span>
            , divSubCategories
         );
         //#endregion
         divSubCategories.style.display = "block";
         divSubCategories2.style.display = "none";
      } else {
         divSubCategories.style.display = "none";
         divSubCategories2.style.display = "none";
      }
   };
   //#endregion ############## FIN REGION ##############

   // ############## REGION RENDER DE CATEGORIA (NIVEL 2) ##############
   renderSubCategories2 = (category,subCategory2) => { // cambiar por subCategory
      const {itemsReducer:{category3}} = this.props
      let divSubCategories2 = document.getElementById('subMenuNivel2');
      let divSubCategories3 = document.getElementById('subMenuNivel3');
      if (subCategory2?.subC2?.length > 0) {
         // console.log("");
         const listSubCategory = subCategory2.subC2.map((subC2) =>{
            let find = category3.find(cat3 => subCategory2.category === cat3.category && subCategory2.subcategory === cat3.subcategory && cat3.subcategory2 === subC2.U_Subcategoria2)
            if(!find){
               find = []
            }
            return(
               <div>
               <span
                  className='nav-link'
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => this.subCategorySearch(category, subCategory2.subcategory, subC2.U_Subcategoria2)}
               onMouseOver = {() => this.renderSubCategories3(category,subCategory2.subcategory,find)}
               >{subC2.U_Subcategoria2}
               </span>
               <div class="dropdown-divider"></div>
            </div>
            );
            
      });

         ReactDOM.render(
            <span>
               <span style={{ textAlign: "center", fontSize: "0.9rem" }}>Subcategorias de {subCategory2.subcategory}</span>
               <br /><br />
               <div className='designScroll' style={{ maxHeight: 305 }}>
                  {listSubCategory}
               </div>
            </span>
            , divSubCategories2
         );
         divSubCategories2.style.display = "block";
         divSubCategories3.style.display = "none";
      } else {
         divSubCategories2.style.display = "none";
         divSubCategories3.style.display = "none";
      }

   };
   // ############## FIN REGION ##############

  // ############## REGION RENDER DE CATEGORIA (NIVEL 3) ##############
  renderSubCategories3 = (category,subC1,subCategory3) => { // cambiar por subCategory
   // const {itemsReducer:{category3}} = this.props
   let divSubCategories3 = document.getElementById('subMenuNivel3');
   if (subCategory3?.subC3?.length > 0) {
      const listSubCategory = subCategory3.subC3.map((subC3) =>{
         // let find = category3.find(cat3 => cat3.Subcategory2 === subC3.U_Subcategoria2)
         // if(!find){
         //    find = []
         // }
         return(
            <div>
            <span
               className='nav-link'
               style={{ fontSize: "0.9rem" }}
               onClick={() => this.subCategorySearch(category,subC1,subCategory3.subcategory2,subC3.U_Subcategoria3)}
            // onMouseOver = {() => this.renderSubFamilies3(find)}
            >{subC3.U_Subcategoria3}
            </span>
            <div class="dropdown-divider"></div>
         </div>
         );
         
   });

      ReactDOM.render(
         <span>
            <span style={{ textAlign: "center", fontSize: "0.9rem" }}>Subcategorias de {subCategory3.subcategory2}</span>
            <br /><br />
            <div className='designScroll' style={{ maxHeight: 305 }}>
               {listSubCategory}
            </div>
         </span>
         , divSubCategories3
      );
      divSubCategories3.style.display = "block";
   } else {
      divSubCategories3.style.display = "none";
   }

};
// ############## FIN REGION ##############

   
   render() {
      const { itemsReducer:{categories,category1} } = this.props;
      return (
         <div className='d-flex flex-row justify-content-start '>

            {/* ############## REGION DE CATEGORIAS (NIVEL 1) ############## */}
            <div id="Drop-Familia" className='col-2' style={{ minWidth: 248 }}>
               <span style={{ textAlign: "center" }}>CATEGORÍAS</span>
               <br /><br />
               <div className='designScroll' style={{ maxHeight: 305 }}>
                  {/* CAmbiar por las subCategorias de DIBCO */}
                  {categories.length > 0 && categories.map(category => {
                     let find = category1.find(cat => cat.category === category.U_Categoria)
                     if(!find){
                        find = []
                     }
                     return (
                        <div>
                           <span
                              className='nav-link'
                              style={{ fontSize: "0.9rem" }}
                              onClick={() => this.subCategorySearch(category.U_Categoria)}
                              onMouseOver={() => this.renderSubCategories(find)}
                           >{category.U_Categoria}
                           </span>
                           <div class="dropdown-divider"></div>
                        </div>
                     );
                  })}
               </div>
            </div>
            {/* ############## FIN REGION ############## */}


            {/* ############## REGION DE SUBCATEGORIAS (NIVEL 1) ############## */}
            <div id='subMenuNivel1' className='col-2' style={{ minWidth: 248, display: 'none' }}>
            </div>
            {/* ############## FIN REGION ############## */}


            {/* ############## REGION DE SUBCATEGORIAS (NIVEL 2) ############## */}
            <div id='subMenuNivel2' className='col-2' style={{ minWidth: 248, display: 'none' }}>
            </div>

             {/* ############## REGION DE SUBCATEGORIAS (NIVEL 3) ############## */}
             <div id='subMenuNivel3' className='col-2' style={{ minWidth: 248, display: 'none' }}>
            </div>
            {/* ############## FIN REGION ############## */}

         </div>
      );
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
)(MenuNavbar);