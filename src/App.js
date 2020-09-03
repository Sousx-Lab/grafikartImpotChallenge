import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [declaration, setDeclaration] = useState({
    income: "",
    situation:"",
    children: 0,
    netIncome:"",
  });

  let taxSchedule  = [
    {somme: 10064, rate: 0},
    {somme: 25659, rate: 11},
    {somme: 73369, rate: 30},
    {somme: 157806, rate: 41},
    {somme: Infinity, rate: 45},
  ];

  const handleDeclaration = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setDeclaration({...declaration, [name]: value});
  }

  //Calcule le quotient familial
  function getFamilyQuotient(situation, children){

    let Fquotient = (situation === "single") ? 1
                    :(situation === "couple") ? 2 
                    :1
    let partByChild = [
        {child: 0, part: 0},
        {child: 1, part: 0.5},
        {child: 2, part: 0.5},
        {child: 3, part: 1}
    ];
    if(parseInt(children, 10) > 0){
      for(let i = 0; i <= parseInt(children, 10); i++){
        if(i >= partByChild.length){
          partByChild.push({child: i, part:1});
        }
        Fquotient+= partByChild[i].part;
      }
    }
    return Fquotient;
  }

  //Calcule la partie impossable...
  function getTaxable(income, fQuotient){
    const parsedIncome = parseInt(income, 10)
    if(parsedIncome && parsedIncome instanceof Number && 
      fQuotient && fQuotient instanceof Number){
    }
    return parsedIncome/fQuotient;
  }

  const [result, setResult] = useState({
    totalTax: 0,
    netIncome:0
  }); 

  function Calculate(incomeTaxable, fQuotient){
      let alreadyCounted = 0;
      let i = 0;
      let taxByslice = [];
      while(alreadyCounted < incomeTaxable){
          if(i===0){
            taxByslice.push((taxSchedule[i].somme - alreadyCounted) * taxSchedule[i].rate);

          }else if(taxSchedule[i].somme > incomeTaxable) {
            taxByslice.push((incomeTaxable - taxSchedule[i-1].somme+1) * taxSchedule[i].rate);
            
          }else{
            taxByslice.push((taxSchedule[i].somme - taxSchedule[i-1].somme-1) * taxSchedule[i].rate);
            
          }
          alreadyCounted = taxSchedule[i].somme;
          result.totalTax = Math.round(taxByslice.reduce((a, b) => a + b, 0))/100 * fQuotient;
          result.netIncome = incomeTaxable - result.totalTax;
          console.log(result);
          i++;
      }
  }
  
  useEffect(() => {
    let fQuotient = getFamilyQuotient(declaration.situation, declaration.children);
    Calculate(getTaxable(declaration.income, fQuotient), fQuotient);
  },[declaration]);

  return (
    <div className="container">
      <div className="App col-sm-10 pt-4 text-justify">
        <form className="">
          <div className="form-group">
            <label htmlFor="incomes">Vos revenus</label>
              <input type="number" className="form-control"
                id="incomes"
                  name="income"
                    value={declaration.income}
                      onChange={handleDeclaration}
                        placeholder="32000"/> 
                  </div>
          <fieldset>
            <legend>Situation</legend>
              <div className="form-group">
              <div className="custom-control custom-radio">
            <input type="radio" className="custom-control-input" 
              id="single"
                name="situation"
                  value="single"
                   onChange={handleDeclaration}/>
            <label className="custom-control-label" htmlFor="single">	Célibataire, divorcé ou veuf</label>
          </div>
                <div className="custom-control custom-radio">
                <input type="radio" className="custom-control-input" 
                  id="couple"
                    name="situation"
                      value="couple"
                       onChange={handleDeclaration}/>
            <label className="custom-control-label" htmlFor="couple">Couple marié ou pacsé</label>
          </div>
        </div>
      </fieldset>

          <div className="form-group">
            <label htmlFor="children">Nombres d'enfants</label>
              <input type="number" className="form-control"
                id="children"
                  name="children"
                   value={declaration.children}
                    onChange={handleDeclaration}
                      placeholder="Nombres d'enfants à charge" 
                />
          </div>

          <div className="form-group" >
            <label htmlFor="impots">Montant d'imposition à payer</label>
              <input type="text" readOnly={true} className="form-control"
                name="totalTax"
                 id="impots"
                  value={result.totalTax} 
              />
          </div>

          <div className="form-group" >
            <label htmlFor="revnueNet">Revenus Après imposition</label>
            <input type="text" readOnly={true} className="form-control" 
              name="netIncome"
               id="revnueNet" 
                value={result.netIncome}
                 />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
