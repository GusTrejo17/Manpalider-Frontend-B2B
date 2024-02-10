import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css'

const propTypes = {
    totalRowsRefresh: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
}


const defaultProps = {
    initialPage: 1,
    pageSize: 30
}
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.totalRowsRefresh) {
            this.updatePage();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.totalRowsRefresh !== prevProps.totalRowsRefresh) {
            this.updatePage();
        }
    }

    updatePage = ()=>{
        var { totalRowsRefresh, pageSize } = this.props;
        var pager = this.state.pager;
        
        // get new pager object for specified page
        pager = this.getPager(totalRowsRefresh, 0, pageSize);
        
        // update state
        this.setState({ pager });
    }
    setPage(page) {
        var { totalRowsRefresh, pageSize } = this.props;
        var pager = this.state.pager;
        
        if (page < 1 || page > pager.totalPages) {
            return;
        }
        // get new pager object for specified page
        pager = this.getPager(totalRowsRefresh, page, pageSize);
        
        // update state
        this.setState({ pager });

        // call change page function in parent component
        this.props.refresh(pager.currentPage);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 30;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

       

        // return object with all pager properties required by the view
        return {
            currentPage: currentPage,
            totalPages: totalPages,
            pages: pages
        };
    }

    render() {
        var { totalRowsRefresh, currentPage, pageSize } = this.props;
        var pager = this.getPager(totalRowsRefresh, currentPage, pageSize);
        //const {pageSize} = this.props;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }
        
        return (
            <ul className="pagination d-flex flex-wrap justify-content-center">
                <li className={pager.currentPage  === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(1)}>Primero</a>
                </li>
                <li className={pager.currentPage  === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage - 1 )}>Anterior</a>
                </li>
                {pager.pages.map((page, index) =>{
                    return (<li key={index} className={pager.currentPage === page ? 'active' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>)}
                )}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}>Siguiente</a>
                </li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.totalPages)}>Último</a>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;