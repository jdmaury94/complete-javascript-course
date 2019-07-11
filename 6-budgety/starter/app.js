var budgetController = (function(){
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }

    Expense.prototype.calculatePercentage=function(totalIncomes){
        if(totalIncomes>0)
            this.percentage=Math.round((this.value/totalIncomes)*100);
     }

    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    var calculateTotal=function(type){
        data.totals[type]=data.allItems[type].map(elem=>elem.value).reduce((a,b)=>a+b,0);
    }

    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0,
        },
        budget:0,
        percentage:0

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

        deleteItem:function(type,ID){
            var ids,indexOf
            ids=data.allItems[type].map(elem=>elem.id);//[0,2,4,6,8]
            indexOf=ids.indexOf(ID);
            if(indexOf!==-1)
                data.allItems[type].splice(indexOf,1);
            
        },
        
        calculateBudget:function(){//Incomes - Expenses
            //1. Sum all the incomes and all the expenses
                calculateTotal('inc')
                calculateTotal('exp')
            //2. Calculate the budget incomes-expenses
                data.budget=data.totals.inc-data.totals.exp;
            //3. Calculate the percentage
                if(data.totals.inc===0)
                    data.percentage='---';
                else
                    data.percentage=Math.floor(data.totals.exp/data.totals.inc*100)+'%';
            },

        calculatePercentages:function(){
            var totalIncomes=data.totals.inc;
            data.allItems.exp.map(elem=>elem.calculatePercentage(totalIncomes));
        },
        
        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }
        },

        getPercentages:function(){
            return data.allItems.exp.map(elem=>elem.percentage);
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
                value:Number(document.querySelector(DOMstrings.inputValue).value)         
            }
        },

        addListItem:function(item,type){//item->ID,description,value
            var html,concept;
            if(type==='inc'){
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                concept='.income__list';
            }
            else if(type==='exp'){
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                concept='.expenses__list';
            }
            html=html.replace('%id%',item.id);
            html=html.replace('%description%',item.description);
            html=html.replace('%value%',item.value);

            document.querySelector(concept).insertAdjacentHTML('beforeend',html);
        },

        deleteListItem:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearHTMLfields:function(){
            var fields,arrayFields;
            fields=document.querySelectorAll('.add__description, .add__value');
            arrayFields=Array.prototype.slice.call(fields);
            arrayFields.forEach(function(elem){
                elem.value='';
            })
            arrayFields[0].focus();
            
        },

        displayBudget:function(object){
            var sign=(object.budget>0)?'+ ':'';
            document.querySelector('.budget__value').textContent=sign+ object.budget;
            document.querySelector('.budget__income--value').textContent=object.totalInc;
            document.querySelector('.budget__expenses--value').textContent=object.totalExp;
            document.querySelector('.budget__expenses--percentage').textContent=object.percentage;
        },

        displayPercentages:function(arrayPercentages){
            document.querySelectorAll('.item__percentage').forEach((node,index)=>node.textContent=arrayPercentages[index]+'%')
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

        document.querySelector('.container').addEventListener('click',ctrlDeleteItem);
    };
    
    var updateBudget=function(){
        //This will be used then when deleting an item.
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget=budgetController.getBudget();
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };

    var updatePercentages=function(){

        //1. Calculate the percentages
        budgetCtrl.calculatePercentages();
        //2. Return the percentages
        var percentages=budgetController.getPercentages();
        //3. Display the percentages on the UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem=function(){
        var input,newItem;
        //1. Get the field input data
        input=UICtrl.getInput();
        if(input.description!=='' && input.value>0){
            //2. Add the item to the budget controller
            newItem=budgetCtrl.addItem(input.type,input.description,input.value);
            //3. Add the item to the UI
            var addListItem=UICtrl.addListItem(newItem,input.type);
            //4. Clear the fields
            UICtrl.clearHTMLfields();  
            //5. Calculate and update the budget
            updateBudget();  
            //6. Update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem=function(event){
        var ID,splitID,type,itemID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID=itemID.split('-');
            type=splitID[0];
            ID=Number(splitID[1]);
            
            //1. Delete item from the data structure
            budgetCtrl.deleteItem(type,ID);
            //2. Delete item from the UI
            UICtrl.deleteListItem(itemID);
            //3. Update and show the new budget
            updateBudget();
            //4. Update percentages
            updatePercentages();
        }
    }

    return {
        init:function(){
            console.log('App has started');
            UICtrl.displayBudget({budget:0,totalInc:0,totalExp:0,percentage:0});
            setUpEventListeners();
        }
    }

})(budgetController,UIcontroller);
controller.init();