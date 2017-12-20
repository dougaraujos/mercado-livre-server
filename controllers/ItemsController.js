/**
 * Module Dependencies
 */

 import fetch from 'node-fetch';
 import config from 'config';


 class ItemsController {
 	constructor(router) {
 		this.router = router;
 		this.registerRoutes();
 	}

 	registerRoutes() {
 		this.router.get('/items', this.fetch.bind(this));
 		this.router.get('/items/:id', this.get.bind(this));
 	}

 	fetch(request, response){
 		const { limit = 4, search } = request.query;

 		const url = `${config.apiTrace.host}/sites/MLA/search?q=${search}&limit=${limit}`;

 		fetch(url).then(data => data.json()).then((responseData) => {
			const { filters, results } = responseData;

			const categories = (
				(
					filters.find((filter) => filter.id == 'category') || {}
				).values || []
			).map(({name}) => name);

			const items = results.map((item) => ({
				id: item.id,
				title: item.title,
				price: {
					currency: item.currency_id,
					amount: Math.floor(item.price),
					decimals: (item.price - Math.floor(item.price)).toFixed(2) * 100
				},
				picture: item.thumbnail,
				condition: item.condition,
				free_shipping: item.shipping.free_shipping
			}));

			const responseSend = {
				author: config.author,
				categories,
				items
			};

			response.status(200);
			response.send(responseSend);
			response.end();
		}).catch(function(err) {
			response.status(500);
			response.send(err);
			response.end();
		});
 	}

 	get(request, response){
 		const { id } = request.params;

 		const url = `${config.apiTrace.host}/items/${id}`;
 		const urlDescription = `${url}/description`;

 		Promise.all([
 		    fetch(url),
 		    fetch(urlDescription)
 		])
 		.then((response) => Promise.all(response.map(data => data.json())))
 		.then(([responseItem, responseDescription]) => {

 			if (responseItem.statusCode < 200 || responseItem.statusCode > 299) {
 				res.status(responseItem.statusCode);
 				res.send(responseItem.message);
 				res.end();
 				return;
 			}

			const item = {
				id: responseItem.id,
				title: responseItem.title,
				price: {
					currency: responseItem.currency_id,
					amount: Math.floor(responseItem.price),
					decimals: (responseItem.price - Math.floor(responseItem.price)).toFixed(2) * 100
				},
				picture: responseItem.pictures[0].url,
				condition: responseItem.condition,
				free_shipping: responseItem.shipping.free_shipping,
				sold_quantity: responseItem.sold_quantity,
				description: responseDescription.text || responseDescription.plain_text
			};

			const responseSend = {
				author: config.author,
				item
			};

			response.status(200);
			response.send(responseSend);
			response.end();
 		})
 		.catch(function(err) {
			response.status(404);
			response.send(err);
			response.end();
		});
 	}
 }


 export default ItemsController;