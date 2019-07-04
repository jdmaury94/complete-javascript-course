var budgetController = (function(){
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    };

    return {
        addItem:function(type,description,value){
            var ID,newItem;
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else
                ID=0;

            if(type==='exp'){
                newItem=new Expense(ID,description,value);
            }
              
            else if(type==='inc') {
                newItem=new Income(ID,description,value);
            } 
            data.allItems[type].push(newItem);
            //aca retorna el newItem
            return newItem;//ID,description,value
        },
        getData:function(){
            return data;
        }
    }

})();


var UIcontroller=(function(){

    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'
    }
    
    return {
        getInput:function(){
            return {
                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:document.querySelector(DOMstrings.inputValue).value            
            }
        },

        addListItem:function(item,type){//item->ID,description,value
            var html,concept;
            if(type==='inc'){
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                concept='.income__list';
            }
            else if(type==='exp'){
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                concept='.expenses__list';
            }
            html=html.replace('%id%',item.id);
            html=html.replace('%description%',item.description);
            html=html.replace('%value%',item.value);

            document.querySelector(concept).insertAdjacentHTML('beforeend',html);
        },

        getDOMStrings:function(){
            return DOMstrings;
        }
    }    
})();

var controller=(function(budgetCtrl,UICtrl){

    var setUpEventListeners=function(){
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(e){
            if(e.keyCode===13){
                ctrlAddItem();
            }   
        })
    };

    var ctrlAddItem=function(){
        //1. Get the field input data
        var input=UICtrl.getInput();
        //2. Add the item to the budget controller
        var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
        //3. Add the item to the UI
        var addListItem=UICtrl.addListItem(newItem,input.type);
        //4. Calculate the budget
        //5. Display the budged on the UI
        console.log('It works');
    };

    return {
        init:function(){
            console.log('App has started');
            setUpEventListeners();
        }
    }

})(budgetController,UIcontroller);
controller.init();