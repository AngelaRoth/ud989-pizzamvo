// NOTE that Model (or data) and View never directly talk to one another; the Octopus connects them, but also allows them to move more independantly than if they were wired together. This means you can change the way your app looks w/o messing up your model code, and vice versa.

$(function() {

    var data = {
        lastID: 0,
        pizzas: []
    };

    // Function in here are all ways of getting between the Model and the View.
    var octopus = {
        addPizza: function() {
            var thisID = ++data.lastID;

            data.pizzas.push({
                id: thisID,
                visible: true
            });
            view.render();
        },

        removePizza: function(pizza) {
            var clickedPizza = data.pizzas[ pizza.id - 1 ];
            clickedPizza.visible = false;
            view.render();
        },

        // A tunnel the view uses to get the data from the model. Rather than the view saying, hey model, what pizzas do we have; the model asks the octopus and the octopus goes and gets the pizzas.
        // Takes all the pizzas from the model, filters them, and only returns those pizzas where pizza.visible = true.
        getVisiblePizzas: function() {
            var visiblePizzas = data.pizzas.filter(function(pizza) {
                return pizza.visible;
            });
            return visiblePizzas;
        },

        // When you call octopus.init, it does all the necessary things to get our application up and running. In this case, the only thing it has to do is tell the view to initialize itself.
        init: function() {
            view.init();
        }
    };


    var view = {
        init: function() {
            var addPizzaBtn = $('.add-pizza');
            addPizzaBtn.click(function() {
                octopus.addPizza();
            });

            // grab elements and html for using in the render function
            this.$pizzaList = $('.pizza-list');
            this.pizzaTemplate = $('script[data-template="pizza"]').html();

            // Delegated event to listen for removal clicks
            // We're adding a click listener for the pizza list, and if we're clicking on a remove-pizza button, we're running the function that figures out what we've clicked on, and ultimately calls teh removePizza function.
            this.$pizzaList.on('click', '.remove-pizza', function(e) {
                var pizza = $(this).parents('.pizza').data();
                octopus.removePizza(pizza);
                return false;
            });

            // Last step: Tell the view to render itself.
            this.render();
        },

        // Render function clears the pizza list entirely and re-renders all the visible pizzas. Not very smart or optimized, but it works just fine.
        render: function() {
            // Cache vars for use in forEach() callback (performance)
            var $pizzaList = this.$pizzaList,
                pizzaTemplate = this.pizzaTemplate;

            // Clear and render
            $pizzaList.html('');
            octopus.getVisiblePizzas().forEach(function(pizza) {
                // Replace template markers with data
                // Fill in the template HTML with the pizza ID and then adding it to the pizza list in the DOM
                var thisTemplate = pizzaTemplate.replace(/{{id}}/g, pizza.id);
                $pizzaList.append(thisTemplate);
            });
        }
    };

    octopus.init();
}());
