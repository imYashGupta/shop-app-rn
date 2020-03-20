import PRODUCTS from "../../data/products";
import {CREATE_PRODUCT, UPDATE_PRODUCT, GET_PRODUCTS, FAVORITE, GET_FAVORITES, DELETE_PRODUCT} from "../actions/product"
import Product from "../../models/product";
import { ToastAndroid } from "react-native";
const initialState = {
    products:[],
    userProducts: [],
    favorites:[]
};

export default (state = initialState,action) => {
    const type = action.type;
    const allProducts=state.products;
    switch (type) {
        case GET_PRODUCTS:
            let products = action.products;
            if (action.loadmore) {
                products=[...state.products,...action.products];
            } 
            return {
                products: products,
                userProducts: products.filter(product => product.ownerId == action.user),
                favorites:[]
            }

        case CREATE_PRODUCT:
            // const newProduct = new Product(
            //         action.product.id, 
            //         1, 
            //         action.product.title, 
            //         action.product.imageUrl, 
            //         action.product.desc,
            //         action.product.price
            //     );
            return {
                ...state,
                products: [action.product,...state.products],
                userProducts: [action.product,...state.userProducts],
            }
            break;
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(product => product.id===action.pid);
            const updatedProduct =  action.product;
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;

            const allProductIndex = state.products.findIndex(product => product.id === action.pid);
            const updateProducts=[...state.products];
            updateProducts[allProductIndex] = updatedProduct;
            return {
                ...state,
                products: updateProducts,
                userProducts: updatedUserProducts
            }
            break;
        case DELETE_PRODUCT:
            const deletedProduct = action.product;
            let d_products = [...state.products];
            let userProducts = [...state.userProducts];
            let indexInProduct = d_products.findIndex(p => p.id==deletedProduct.id);
            let indexInUserProduct = userProducts.findIndex(p => p.id==deletedProduct.id);
            d_products.splice(indexInProduct,1);
            userProducts.splice(indexInUserProduct,1);
            return {
                ...state,
                products: d_products,
                userProducts: userProducts
            }
        case FAVORITE:
            let product = action.product;
            product.isFav=!!action.favorite;
            let theProducts= [...state.products];
            const indexOfFavProduct = theProducts.findIndex(p => p.id==product.id);
            theProducts[indexOfFavProduct] = product;

            let theFavorites= [...state.favorites];
            if(action.favorite==0){
                const indexInFav=theFavorites.findIndex(p => p.id == product.id);
                theFavorites.splice(indexInFav,1);
                ToastAndroid.show("Product removed from WishLists", ToastAndroid.SHORT);
                return {
                    ...state,
                    products: theProducts,
                    favorites: theFavorites,
                }
            }
            else{
                ToastAndroid.show("Product added to WishLists",ToastAndroid.SHORT);
                return {
                    ...state,
                    products: theProducts,
                    favorites: [product, ...theFavorites],
                }
            }

            break;
        case GET_FAVORITES:
            return {
                ...state,
                favorites:action.favorites
            }
        default:
            break;
    }
    return state;
}
 