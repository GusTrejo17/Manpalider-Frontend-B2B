import React, { Component } from 'react';
import { config, SERVICE_API, VIEW_NAME, DISPATCH_ID } from '../libs/utils/Const';
import { connect } from "react-redux";
import $ from 'jquery';
import CurrencyFormat from 'react-currency-format';
import { BreadCrumb } from './index'
import "./ItemSlider.css";
import { Redirect } from 'react-router';

let debounceDelay = 3000;
class SideBarItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            seleccionados: [],
            categoryShow: 5,
            showFab: 10,
            PriceValue: '',
            debounceTimeout: null,
            count: 0,
            additionalToShow: 5, // Número adicional de marcas para mostrar al hacer clic en "Ver más"
            cantidadMostrada: 10, // Número de marcas mostradas inicialmente
            showVerMasBrand: true, // Mostrar "Ver más" al principio
        };
        // this.debounceDelay = 1200; 
    }


    seeAllCategories = () => {
        $('#filterCategoriesModal').modal('show');
    }
    uniqueFilter = async (property, value, value2) => {
        const { itemsReducer, setItemsFilters, itemsReducer: { location, searchByCategories, searchCategoryObj }, setNextPage, setSearchCategoryObj, setLocation} = this.props;
        let data = { property: property, value: value, value2, value2 }
        let viewOne = location;
        // Nueva variable de redux para guardar filtro
        await setItemsFilters(data);
        if (location === 'menuCategories') {
            // setNextPage(0)
            // searchByCategories('', 0, '', '');

            //Se hizo una busqueda por categoría y luego por marca
            await setLocation('menuCategories')
            await setItemsFilters('');
            //Se rescata el valor de searchCategoryObj para agregarle la marca que se selecciona
            const existSearchCategoryObj = { ...searchCategoryObj };
            existSearchCategoryObj.brand = value[0] || null;

            await setSearchCategoryObj(existSearchCategoryObj);
            searchByCategories(existSearchCategoryObj, 0, '', '');

        } else {
            setTimeout(async () => {
                //Se selecciono solo la marca
                // Ejecutar searchByKey
                if (viewOne && viewOne !== '') {
                    await itemsReducer.searchByKey(0, viewOne);
                } else {
                    await itemsReducer.searchByKey();
                }
            }, 350);
            $('#filterCategoriesModal').modal('hide');
        }
        this.setState({ PriceValue: '' });
    };

    deleteFilters = async () => {
        const { itemsReducer, setItemsFilters, viewOne, setLocation } = this.props;

        // Nueva variable de redux para guardar filtro
        setItemsFilters('');
        setTimeout(async () => {
            // Ejecutar searchByKey
            await setLocation('navBar')
            if (viewOne && viewOne !== '') {
                await itemsReducer.searchByKey(0, viewOne);
            } else {
                await itemsReducer.searchByKey();
            }

        }, 350);
        await this.setState({
            PriceValue: '',
            seleccionados: []
        })
        $('#filterCategoriesModal').modal('hide');
    }
    handleVerMas = () => {
        this.setState((prevState) => ({
            categoryShow: prevState.categoryShow + prevState.additionalToShow,
        }));
    };

    handleVerMenos = () => {
        this.setState((prevState) => ({
            categoryShow: prevState.categoryShow - prevState.additionalToShow,
        }));
    };


    // Función para mostrar más marcas
    handleVerMasBrand = () => {
        this.setState((prevState) => ({
            cantidadMostrada: prevState.cantidadMostrada + prevState.additionalToShow,
        }));
    };

    handleVerMenosBrand = () => {
        this.setState((prevState) => ({
            cantidadMostrada: prevState.cantidadMostrada - prevState.additionalToShow,
        }));
    };


    // verMenos = (filter) => {
    //     if (filter === 'category') {
    //         this.setState((prevState) => ({
    //             categoryShow: prevState.categoryShow - 5
    //         }));
    //     } else if (filter === 'brand') {
    //         this.setState((prevState) => ({
    //             cantidadMostrada: prevState.cantidadMostrada - 10
    //         }));
    //     } else if (filter === 'fab') {
    //         this.setState((prevState) => ({
    //             showFab: prevState.showFab - 10
    //         }));
    //     }
    //     this.setState({ showVerMas: true });
    //     this.setState({ showVerMasBrand: true });
    // };

    handleCheckboxClick2 = async (event) => {
        const { seleccionados } = this.state //--ARRAY DONDE ESTAN LOS CHECKS SELECCIONADOS
        const { dataCategories, itemsReducer, setBrandsCopy, setShowBrandsCopy } = this.props
        const opcionSeleccionada = event.target.value;
        const index = seleccionados.findIndex((brand) => (brand === opcionSeleccionada)); //---BUSCAMOS SI LA MARCA YA FUE SELECCIONADA
        if (index !== -1) {//---EL CHECK YA HABIA SIDO SELECCIONADO
            /*AGREGAMOS EL VALOR DEL CHECK QUE ENCONTRAMOS*/
            let newArray = seleccionados.slice();
            if (newArray[index] == opcionSeleccionada) {//-SI SELECCIONAMOS EL MISMO VALOR LO DEBEMOS ELIMINAR                    
                let find = newArray.filter(check => check != opcionSeleccionada);
                await this.setState({
                    seleccionados: find
                })
            } else {//----SINO SE ENCUENTRA LO AGREGAMOS
                newArray[index] = opcionSeleccionada;
                await this.setState({
                    seleccionados: newArray
                })
            }
        } else {
            /*AGREGAMOS EL NUEVO ATRIBUTO SELECCIONADO AL ARRAY DE LOS ATRIBUTOS SELECCIONADOS [arrSelected] */
            let newArray = seleccionados.slice();
            newArray.push(opcionSeleccionada)
            await this.setState({
                seleccionados: newArray,
            });
        }
        if (!itemsReducer.showCopy) {
            setBrandsCopy(dataCategories.itemsBrands.slice())
            setShowBrandsCopy(true)
        }

        //A futuro cuando se selecciona un check se reinicia el timeout para ir a hacer la busqueda
        //   if (this.state.debounceTimeout) {
        //     clearTimeout(this.state.debounceTimeout);
        //   }
        //   const debounceTimeout = setTimeout(() => {
        //     if(this.state.seleccionados.length === 0){
        //         this.uniqueFilter('','', '')
        //     }else{
        //         this.uniqueFilter('marca',this.state.seleccionados, '')
        //     }
        //     this.setState({ debounceTimeout: null }); 
        //   }, this.debounceDelay);

        //   this.setState({ debounceTimeout });
        if (this.state.seleccionados.length === 0) {
            this.uniqueFilter('', '', '')
        } else {
            this.uniqueFilter('marca', this.state.seleccionados, '')
        }
    }

    DeleteFilter = async (filter) => {
        const { setShowBrandsCopy } = this.props
        setShowBrandsCopy(false)
        if (filter === 'MARCAS') {
            this.setState({
                seleccionados: [],
                cantidadMostrada: 10
            })
            this.uniqueFilter('', '', '')
        } else if (filter === 'CATEGORIAS') {
            const { setSearchCategoryObj, setLocation } = this.props
            this.setState({
                categoryShow: 5
            })
            await setLocation('')
            let search = {
                category: null,
                subC1: null,
                subC2: null,
                subC3: null
            }
            await setSearchCategoryObj(search)
            if (this.state.seleccionados.length !== 0) {
                this.uniqueFilter('marca', this.state.seleccionados, '')
            } else {
                this.uniqueFilter('', '', '')
            }
        }






    }

    changePrice = async (event) => {
        this.setState({ PriceValue: event.target.value });
    };


    subCategorySearch = async (category, subC1 = '', subC2 = '', subC3 = '') => {
        const { setItemsFilters, setIdCategory, setLocation, itemsReducer: { searchByCategories, location, uniqueFilter}, setNextPage, setSearchCategoryObj } = this.props;
        setIdCategory(category);
        setNextPage(0);
        if (location === 'menuCategories') {
            setItemsFilters({});
        }
        setLocation('menuCategories')
        let search = {
            category: category,
            subC1,
            subC2,
            subC3
        }
        await setSearchCategoryObj(search)
        if (location === 'navBar' && !uniqueFilter) {
            //Despues de borrar filtro se selecciona una categoria y despues una marca
            setLocation('menuCategories'); //Poder mandar la marca como parametro para la busqueda que hace la categoria
            
            let search = {
                category: category,
                subC1,
                subC2,
                subC3,
                brand : uniqueFilter?.value?.[0]
            }
            await setSearchCategoryObj(search);
        }else{
            if (location === 'navBar' && uniqueFilter) {
                //Se selecciona primero una marca y luego una categoria
                await setItemsFilters({});
                
                setLocation('menuCategories'); //Poder mandar la marca como parametro para la busqueda que hace la categoria
                let search = {
                    category: category,
                    subC1,
                    subC2,
                    subC3,
                    brand : uniqueFilter?.value?.[0]
                }
                await setSearchCategoryObj(search);
            }
        }
        await searchByCategories(search, 0, '', '');
    };
    render() {
        const { totalRows, dataCategories, itemsReducer: { showCopy, brandsCopy, categories, category1, category2, category3, searchCategoryObj, location } } = this.props;
        const { seleccionados, cantidadMostrada, PriceValue, categoryShow } = this.state
        let category = []
        if (dataCategories.itemsCategories) {
            for (let index = 0; index < dataCategories.itemsCategories.length; index++) {
                const itms = dataCategories.itemsCategories[index];
                let findCategory = categories.find(cat => cat.U_Categoria === itms.category)
                if (findCategory) {
                    category.push(findCategory)
                }
            }
        }
        // if(location === 'menuCategories'){ // VENIMOS DE SELECCIONAR UNA CATEGORIA DEL MENÚ
        //     if(searchCategoryObj.category === null ){
        //         category = categories
        //     }else{
        //         let categoryObj = categories.find(cat => cat.U_Categoria === searchCategoryObj.category)
        //         if(categoryObj){
        //             category.push(categoryObj)
        //         }
        //     }
        // }else{
        //     category = categories
        // }
        // Variable que limita no. de caracteres de nombre de categorías
        let categoryStringLimiter = 20;
        // Limitante de categorias mostradas en SideBar
        let limitNumber = 10;
        // Modal de categorias
        let twoColumns = dataCategories ? dataCategories.itemsCategories ? dataCategories.itemsCategories.length >= 10 ? Number(((dataCategories.itemsCategories.length + 9) / 2).toFixed(0)) : dataCategories.itemsCategories.length : 0 : 0;
        // if (!category || !category.length) {
        //     return <Redirect to="/" />;
        // } else {
            return (
                <div>
                    {/* <div> <BreadCrumb data={dataCategories.itemsCategories}/></div> */}
                    <div>{totalRows > 1 ? totalRows + ' resultados' : totalRows + ' resultado'}</div>
                    <div>
                        <button
                            className="btn btn-link border-0"
                            onClick={() => this.deleteFilters()}
                            style={{ textDecoration: 'none', fontWeight: 'bold', color: config.Back.color, cursor: 'pointer' }}
                        >Borrar filtros</button>
                    </div>
                    {/* Categorías */}
                    {(category && category.length > 0) &&
                        <>
                            <h5 className="mt-md-5 font-weight-bold TituloCategoria" >Categorías</h5>

                            <ul>
                                {/* {category.length !== categories.length  && (
                                        <label style={{color: "#0078c0",cursor:'pointer'}} onClick={()=>this.DeleteFilter('CATEGORIAS')}>Borrar filtro Categorías</label>
                            )} */}
                                {category.slice(0, categoryShow).map((categoria, index) => (
                                    <li key={index} >
                                        <div
                                            className="category-nombre"
                                            style={{ cursor: 'pointer', color: config.Back.color}}
                                            onClick={() => this.subCategorySearch(categoria.U_Categoria)}
                                        >
                                            {categoria.U_Categoria}
                                        </div>

                                        <ul>
                                            {category1.length > 0 && category1.map((subCategory1, subC1Index) => (
                                                <li>
                                                    {subCategory1.category === categoria.U_Categoria && subCategory1.subC1.map((subC1) => (
                                                        <div >
                                                            <div className="category"
                                                                style={{ cursor: 'pointer' }} onClick={() => this.subCategorySearch(categoria.U_Categoria, subC1.U_Subcategoria1)}>
                                                                {subC1.U_Subcategoria1}
                                                            </div>
                                                            <ul>
                                                                {category2.length > 0 && category2.map((subCategory2, subC2Index) => (
                                                                    <li>
                                                                        {subCategory2.category === subCategory1.category && subCategory2.Subcategory1 === subC1.U_Subcategoria1 && subCategory2.subC2.map((subC2) => (
                                                                            <div>
                                                                                <div className="category"
                                                                                    style={{ cursor: 'pointer' }} onClick={() => this.subCategorySearch(categoria.U_Categoria, subC1.U_Subcategoria1, subC2.U_Subcategoria2)}>
                                                                                    {subC2.U_Subcategoria2}
                                                                                </div>
                                                                                <ul>
                                                                                    {category3.length > 0 && category3.map((subCategory3, subC3Index) => (
                                                                                        <li>
                                                                                            {subCategory3.category === subCategory2.category && subCategory3.Subcategory1 === subCategory2.Subcategory1 && subCategory3.Subcategory2 === subC2.U_Subcategoria2 && subCategory3.subC3.map((subC3) => (
                                                                                                <div className="category"
                                                                                                    style={{ cursor: 'pointer' }} onClick={() => this.subCategorySearch(categoria.U_Categoria, subC1.U_Subcategoria1, subC2.U_Subcategoria2, subC3.U_Subcategoria3)}>
                                                                                                    {subC3.U_Subcategoria3}
                                                                                                </div>
                                                                                            ))}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        ))}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                                {categoryShow < category.length && (
                                    <label style={{ color: config.Back.color, cursor: 'pointer', marginRight: '10px' }} onClick={this.handleVerMas}>
                                        <strong> Ver más</strong>
                                    </label>
                                )}
                                {categoryShow > 5 && (
                                    <label style={{ color: config.Back.color, cursor: 'pointer', marginRight: '10px' }} onClick={this.handleVerMenos}>
                                        <strong> Ver menos</strong>
                                    </label>
                                )}

                            </ul>
                        </>
                    }
                    {/* Marcas */}
                    {dataCategories.itemsBrands.length > 0 && (
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Marcas</h5>
                    )}
                    {(!showCopy && dataCategories.itemsBrands.length > 0) && (
                        <ul className="mt-2 SubCategorias">
                            <dl>
                                {seleccionados.length > 0 && (
                                    <label style={{ color: config.Back.color, cursor: 'pointer' }} onClick={() => this.DeleteFilter('MARCAS')}>
                                        Borrar filtro Marcas
                                    </label>
                                )}
                                {dataCategories.itemsBrands.slice(0, this.state.cantidadMostrada).map((brand, index) => {
                                    return (
                                        <div className='align-items-center' key={index}>
                                            <input
                                                className='mr-2 d-inline-block'
                                                type='checkbox'
                                                id={`opcion-${brand.brand}`}
                                                value={brand.brand}
                                                checked={seleccionados.includes(brand.brand.toString())}
                                                onClick={(event) => this.handleCheckboxClick2(event)}
                                            />

                                            <label className='d-inline-block' htmlFor={`opcion-${brand.brand}`}>{brand.brand}</label><br></br>
                                        </div>
                                    );
                                })}
                                {this.state.showVerMasBrand && this.state.cantidadMostrada < dataCategories.itemsBrands.length && (
                                    <label style={{ color: config.Back.color, cursor: 'pointer', marginRight: '10px' }} onClick={this.handleVerMasBrand}>
                                        <strong> Ver más</strong>
                                    </label>
                                )}
                                {this.state.cantidadMostrada > 10 && (
                                    <label style={{ color: config.Back.color, cursor: 'pointer', marginRight: '10px' }} onClick={this.handleVerMenosBrand}>
                                        <strong> Ver menos</strong>
                                    </label>
                                )}
                            </dl>
                        </ul>
                    )}

                    {(showCopy && brandsCopy && brandsCopy.length > 0) &&
                        <ul className="mt-2 SubCategorias">
                            <dl>
                                {seleccionados.length > 0 && (
                                    <label style={{ color: "#0078c0", cursor: 'pointer' }} onClick={() => this.DeleteFilter('MARCAS')}>Borrar filtro Marcas</label>
                                )}
                                {brandsCopy.slice(0, cantidadMostrada).map((brand, index) => {
                                    return (
                                        <>
                                            <div className='align-items-center' key={index}>
                                                <input
                                                    className='mr-2 d-inline-block'
                                                    type="checkbox"
                                                    id={`opcion-${brand.brand}`}
                                                    value={brand.brand}
                                                    checked={seleccionados.includes(brand.brand.toString())}
                                                    onClick={(event) => this.handleCheckboxClick2(event)} />
                                            </div>

                                        </>
                                    );


                                })}
                                {cantidadMostrada < brandsCopy.length && (
                                    <label style={{ color: "#0078c0", cursor: 'pointer' }} onClick={() => this.verMas('brand')}><strong> Ver más</strong></label>
                                )}
                                {cantidadMostrada > 10 && (
                                    <label style={{ color: "#0078c0", cursor: 'pointer' }} onClick={() => this.verMenos('brand')}><strong>Ver menos</strong></label>
                                )}



                            </dl>
                        </ul>
                    }
                    {/* Fábricas */}
                    {/* {(dataCategories && dataCategories.itemsFacilities.length > 0) && 
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Fábricas</h5>
                    } */}
                    {/* {(dataCategories && dataCategories.itemsFacilities.length > 0) && 
                        <ul className = "mt-2 SubCategorias">
                            <dl>
                                {dataCategories.itemsFacilities.slice(0,showFab).map(facility => {
                                    return  <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('fabrica', facility.facility, '')}>
                                                {facility.facility} 
                                            </dd>
                                })}
                            </dl>
                            {showFab <= dataCategories.itemsFacilities.length  &&(
                                    <label style={{color: "#0078c0",cursor:'pointer'}} onClick={()=>this.verMas('fab')}><strong> Ver más</strong></label>
                                )}
                                {showFab >10 && (
                                    <label style={{color: "#0078c0",cursor:'pointer'}} onClick={()=>this.verMenos('fab')}><strong>Ver menos</strong></label>
                                )}
                        </ul>
                    } */}

                    {(dataCategories && dataCategories.pricesSideBar) &&
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Precios</h5>
                    }
                    <div>
                        {(dataCategories && dataCategories.pricesSideBar) && (
                            <ul className="mt-2 SubCategorias">
                                <dl>
                                    <div class="input-group mb-3 pr-5">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Hasta:</span>
                                        </div>
                                        <input
                                            class="form-control"
                                            type="text"
                                            id="PriceInptFilter"
                                            placeholder=""
                                            onChange={this.changePrice}
                                            onKeyDown={(event) => {
                                                if (PriceValue !== 0 || PriceValue !== '') {
                                                    if (event.keyCode === 13) {
                                                        this.uniqueFilter('precio', Number(PriceValue));
                                                        // Después de aplicar el filtro, resetea el valor del precio
                                                        this.setState({ PriceValue: '' });
                                                    }
                                                }
                                            }}
                                            onKeyPress={(event) => {
                                                if (event.charCode < 48 || event.charCode > 57) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            value={PriceValue}
                                        />
                                        <div class="input-group-append d-md-none">
                                            <span class="input-group-text">
                                                <i
                                                    class="fa fa-search mr-1 ml-1"
                                                    onClick={() => {
                                                        if (PriceValue !== 0 || PriceValue !== '') {
                                                            this.uniqueFilter('precio', Number(PriceValue));
                                                            // Después de aplicar el filtro, resetea el valor del precio
                                                            this.setState({ PriceValue: '' });
                                                        }
                                                    }}
                                                    aria-hidden="true"
                                                    style={{ color: "black", cursor: "pointer" }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </dl>
                            </ul>
                        )}
                    </div>
                    {/* Aparatos */}
                    {/* {(dataCategories && dataCategories.itemsDevices.length > 0) && 
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Aparatos</h5>
                    }
                    {(dataCategories && dataCategories.itemsDevices.length > 0) && 
                        <ul className = "mt-2 SubCategorias">
                            <dl>
                                {dataCategories.itemsDevices.map(device => {
                                    return  <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('aparato', device.device, '')}>
                                                {device.device} ({device.times})
                                            </dd>
                                })}
                            </dl>
                        </ul>
                    } */}
                    {/* Refacciones */}
                    {/* {(dataCategories && dataCategories.itemsSpareParts.length > 0) && 
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Refacciones</h5>
                    }
                    {(dataCategories && dataCategories.itemsSpareParts.length > 0) && 
                        <ul className = "mt-2 SubCategorias">
                            <dl>
                                {dataCategories.itemsSpareParts.map(part => {
                                    return  <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('refaccion', part.part, '')}>
                                                {part.part} ({part.times})
                                            </dd>
                                })}
                            </dl>
                        </ul>
                    } */}
                    {/* Precios */}
                    {/* {(dataCategories && dataCategories.pricesSideBar) && 
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Precios</h5>
                    }
                    {(dataCategories && dataCategories.pricesSideBar) && 
                        <ul className = "mt-2 SubCategorias">
                            <dl>
                                <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('precio', dataCategories.pricesSideBar.min, '')}>
                                    Hasta ${(dataCategories.pricesSideBar.min).toFixed(2)}
                                </dd>
                                {(dataCategories.pricesSideBar.min != dataCategories.pricesSideBar.max) && 
                                    <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('precio', dataCategories.pricesSideBar.min, dataCategories.pricesSideBar.max)}>
                                        Entre ${(dataCategories.pricesSideBar.min).toFixed(2)} - ${(dataCategories.pricesSideBar.max).toFixed(2)}
                                    </dd>
                                }
                                <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('precio', '', dataCategories.pricesSideBar.max)}>
                                    Desde ${(dataCategories.pricesSideBar.max).toFixed(2)}
                                </dd>
                            </dl>
                        </ul>
                    } */}
                    {/* Stock */}
                    {/* {(dataCategories && dataCategories.stock) && 
                        <h5 className="mt-md-4 font-weight-bold TituloCategoria">Existencias</h5>
                    } */}
                    {/* {(dataCategories && dataCategories.stock) && 
                        <ul className = "mt-2 SubCategorias">
                            <dl>
                                {(dataCategories.stock.available !== 0) &&
                                    <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('stock', 'A', '')}>
                                        Disponibles {(dataCategories.stock.available)}
                                    </dd>
                                }
                                {(dataCategories.stock.missing !== 0) &&
                                    <dd className = 'linkFilter' onClick = {() => this.uniqueFilter('stock', 'B', '')}>
                                        Agotados {(dataCategories.stock.missing)}
                                    </dd>
                                }
                            </dl>
                        </ul>
                    } */}
                    {/* <div className="modal fade" id="filterCategoriesModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{border: "none", textAlign: 'center'}}>
                        <div className="modal-dialog modal-lg" role="document" style={{margin: '1.75rem auto'}}>
                            <div className="modal-content">
                                <div className="modal-header" style={{background: config.navBar.iconColor}}>
                                    <h5 className="modal-title" style={{color: config.navBar.textColor2}}>Otras categorías</h5>
                                    <button type="button" style={{color: config.navBar.textColor2}} className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body bg3">
                                    <div className = 'row justity-content-center'>
                                    <div className = 'col-md-6'>
                                        {dataCategories && dataCategories.itemsCategories.length > 0 && dataCategories.itemsCategories.map((category, index) => {
                                            if(index >= limitNumber && index <= twoColumns){
                                                if(category.category.includes(',')){
                                                    let categoryNameArray = category.categoryName.split(',');
                                                    let length = categoryNameArray.length;
                                                    let containerReturn = [];
                                                    for (let i = 0; i < categoryNameArray.length; i++) {
                                                        let dinamicCategory = categoryNameArray[i].substring(0, categoryStringLimiter);
                                                        containerReturn.push(<span>
                                                            {(i == 0) && dinamicCategory}
                                                            {((i > 0 && i < (length - 1))) && '/' + dinamicCategory}
                                                            {(i == (length - 1)) && <span className='linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}>/{dinamicCategory}</span>}
                                                            {(i == (length - 1)) && <span className='linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}></span>}
                                                            </span>);
                                                    }
                                                    containerReturn.push(<br/>);
                                                    containerReturn.push(<br/>);
                                                    return containerReturn;
                                                } else {
                                                    let containerReturn = [];
                                                    containerReturn.push(<span className = 'linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}>
                                                            {category.categoryName}
                                                        </span>);
                                                    containerReturn.push(<br/>);
                                                    containerReturn.push(<br/>);
                                                    return containerReturn;
                                                }
                                            } 
                                        })}
                                    </div>
                                    <div className = 'col-md-6'>
                                        {dataCategories && dataCategories.itemsCategories.length > 0 && dataCategories.itemsCategories.map((category, index) => {
                                            if(index >= limitNumber && index > twoColumns){
                                                if(category.category.includes(',')){
                                                    let categoryNameArray = category.categoryName.split(',');
                                                    let length = categoryNameArray.length;
                                                    let containerReturn = [];
                                                    for (let i = 0; i < categoryNameArray.length; i++) {
                                                        let dinamicCategory = categoryNameArray[i].substring(0, categoryStringLimiter);
                                                        containerReturn.push(<span>
                                                            {(i == 0) && dinamicCategory}
                                                            {((i > 0 && i < (length - 1))) && '/' + dinamicCategory}
                                                            {(i == (length - 1)) && <span className='linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}>/{dinamicCategory}</span>}
                                                            {(i == (length - 1)) && <span className='linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}></span>}
                                                            </span>);
                                                    }
                                                    containerReturn.push(<br/>);
                                                    containerReturn.push(<br/>);
                                                    return containerReturn;
                                                } else {
                                                    let containerReturn = [];
                                                    containerReturn.push(<span className = 'linkFilter mr-md-2' onClick = {() => this.uniqueFilter('categorias', category.category, '')}>
                                                            {category.categoryName} 
                                                        </span>);
                                                    containerReturn.push(<br/>);
                                                    containerReturn.push(<br/>);
                                                    return containerReturn;
                                                }
                                            } 
                                        })}
                                    </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                </div>
            );
        // }
    }
}

const mapStateToProps = store => {
    return {
        notificationReducer: store.NotificationReducer,
        shoppingCartReducer: store.ShoppingCartReducer,
        itemsReducer: store.ItemsReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setShoppingCart: value => dispatch({ type: DISPATCH_ID.SHOPPING_CART_SAVE_CART, value }),
        setItemsFilterSearch: value => dispatch({ type: DISPATCH_ID.ITEMS_SAVE_ITEMS_FILTER, value }),
        setNextPage: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_NEXTPAGE, value }),
        searchByDashOption: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_SEARCH_BY_DASH_OPTION, value }),
        setItemsFilters: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_UNIQUE_FILTER, value }),
        setIdCategory: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_IDCATEGORY, value }),
        setLocation: value => dispatch({ type: DISPATCH_ID.ITEMS_SET_LOCATION, value }),
        setSearchCategoryObj: value => dispatch({ type: DISPATCH_ID.ITEMS_CATEGORY_SEARCH, value }),
        setShowBrandsCopy: value => dispatch({ type: DISPATCH_ID.ITEMS_SHOW_BRANDS_COPY, value }),
        setBrandsCopy: value => dispatch({ type: DISPATCH_ID.ITEMS_BRANDS_COPY, value }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SideBarItems);