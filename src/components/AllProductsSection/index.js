import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  loading: 'Loading',
  noProducts: 'NO_PRODUCTS',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    titleSearch: '',
    ratings: '',
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  toClearFilters = () => {
    this.setState(
      {
        category: '',
        titleSearch: '',
        ratings: '',
      },
      this.getProducts,
    )
  }

  onCallSearch = () => {
    this.getProducts()
    this.setState({
      titleSearch: '',
    })
  }

  changeSearchInput = id => {
    console.log(`search input is ${id}`)
    this.setState({
      titleSearch: id,
    })
  }

  onChangeCategory = id => {
    // console.log(`change Category Triggered at id ${id}`)
    this.setState(
      {
        category: id,
      },
      this.getProducts,
    )
  }

  onChangeRating = id => {
    // console.log(`change rating Triggered at id ${id}`)
    this.setState(
      {
        ratings: id,
      },
      this.getProducts,
    )
  }

  onFilteredList = () => {
    const {productsList, titleSearch} = this.state

    const filteredList = productsList.filter(eachItem =>
      eachItem.title.toLowerCase().includes(titleSearch.toLowerCase()),
    )

    return filteredList
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiConstants.loading,
    })
    this.renderLoader()
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, category, titleSearch, ratings} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${ratings}`
    // const apiUrl = 'https://apis.ccbp.in/products?sort_by=${}&category=2&title_search=&rating=4'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      // console.log(fetchedData.total)
      if (fetchedData.total === 0) {
        this.setState({
          apiStatus: apiConstants.noProducts,
        })
      } else {
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStatus: apiConstants.success,
        })
      }
    } else if (response.ok === false) {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderSuccessView = () => {
    const {productsList} = this.state
    return (
      <ul className="products-list">
        {productsList.map(product => (
          <ProductCard productData={product} key={product.id} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderNoProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png "
        alt="no products"
        className="failure-img"
      />
      <h1> No Products Found </h1>
      <p> We could not find any products, try other filters </p>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-sec">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p> We are having some trouble processing your request </p>
      <p> Please try again </p>
    </div>
  )

  // TODO: Add failure view

  displayView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.noProducts:
        return this.renderNoProductsView()
      default:
        return null
    }
  }

  renderProductsList = () => {
    const {activeOptionId, titleSearch, productsList} = this.state

    // const filteredList = this.onFilteredList()

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
          changeSearchInput={this.changeSearchInput}
          titleSearch={titleSearch}
          onCallSearch={this.onCallSearch}
        />
        <div className="filter-and-products-list-sec">
          <FiltersGroup
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            onChangeCategory={this.onChangeCategory}
            onChangeRating={this.onChangeRating}
            toClearFilters={this.toClearFilters}
          />
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    // const {isLoading} = this.state
    const {activeOptionId, titleSearch} = this.state
    // const filteredList = this.onFilteredList()
    // TODO: Add No Products View

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}

        <div className="all-products-container">
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
            changeSearchInput={this.changeSearchInput}
            titleSearch={titleSearch}
            onCallSearch={this.onCallSearch}
          />
          <div className="filter-and-products-list-sec">
            <FiltersGroup
              categoryOptions={categoryOptions}
              ratingsList={ratingsList}
              onChangeCategory={this.onChangeCategory}
              onChangeRating={this.onChangeRating}
              toClearFilters={this.toClearFilters}
            />
            {this.displayView()}
          </div>
        </div>
      </div>
    )
  }
}

export default AllProductsSection
