import * as React from "react";
import { useEffect, useState } from "react";

// import Scale from "../../GameScales/Scale";
// import Sequence from "../../GameFolding/Sequence";
// import Butterfly from "../../GameMath/Butterfly";

import ScalesArea from "../../GameScales/Area";
// import FoldingArea from "../../GameFolding/Area";
// import MathArea from "../../GameMath/Area";

const animalList = new Map([
    ["bug", [1, 3]],
    ["snake", [4, 6]],
    ["bird", [7, 10]],
    ["monkey", [10, 15]],
    ["jaguar", [15, 20]],
    ["lion", [20, 30]],
    ["elephant", [30, 40]]
])

const randNum = (maxNum: number) => {
    return Math.floor(Math.random() * maxNum) + 1;
}

const scale = (arr: number[], factor: number) => {
    var newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(factor * arr[i]);
    }
    return newArr;
}

const add = (arr1: number[], arr2: number[]) => {
    var newArr = [];
    for (let i = 0; i < arr1.length; i++) {
        newArr.push(arr1[i] + arr2[i]);
    }
    return newArr;
}

const GamePage = () => {
    // const [seconds, setSeconds] = useState(1);
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setSeconds(seconds + 1);
    //     }, 1000);
    //     return () => clearInterval(timer);
    // }, [seconds]);

    var gameID;
    var game;
    gameID = 0; // Testing

    if (gameID == 0) {
        var animals : string[] = []
        var listOfSets = [];
        var unkScaleSums = [];
        
        for (let i = 0; i < 4; i++) {
            var newAnimal = Array.from(animalList.keys())[randNum(animalList.size)];
            if (animals.includes(newAnimal)) i--;
            else animals.push(newAnimal);
        }
        
        for (let i = 0; i < 2; i++) {
            var set1 = new Map(); 
            var sum1 = [0, 0];
            for (let j = 0; j < 2; j++) {
                var animal = animals[randNum(4)];
                var numAnimal = randNum(4);
                set1.set(animal, numAnimal);
                sum1 = add(sum1, scale(animalList.get(animal) || [], numAnimal));
            }
        
            var set2 = new Map();
            var animal = animals[randNum(4)];
            var sum2 = animalList.get(animal);
            var numAnimal = 1;
            while (true) {
                sum2 = scale(animalList.get(animal) ||  [], numAnimal);
                if (sum1[0] > sum2[1] || sum1[1] < sum2[0]) numAnimal++;
                else {
                    set2.set(animal, numAnimal);
                    break;
                };
            }   
            
            // Choose which of the sets will be first (on the left) and second (on the right)
            if (Math.random() < 0.5) {
                listOfSets.push(set1);
                listOfSets.push(set2);
            } else {
                listOfSets.push(set2);
                listOfSets.push(set1);
            }
        } 
        
        // Create the last wto sets randomly for the scale that the user needs to figure out
        for (let i = 0; i < 2; i++) {
            var set = new Map(); 
            var sum = [0, 0];
            var count = Math.random() < 0.5 ? 1 : 2;
            for (let j = 0; j < count; j++) {
                var animal = animals[randNum(4)];
                var numAnimal = randNum(4);
                set.set(animal, numAnimal);
                sum = add(sum, scale(animalList.get(animal) || [], numAnimal));
            }
            unkScaleSums.push(sum);
            listOfSets.push(set);
        }
        
        var answer;
        if (unkScaleSums[0][0] > unkScaleSums[1][0] && unkScaleSums[0][1] > unkScaleSums[1][1]) answer = -1;
        else if (unkScaleSums[0][0] < unkScaleSums[1][0] && unkScaleSums[0][1] < unkScaleSums[1][1]) answer = 1;
        else answer = 0;
        
        game = <ScalesArea left1={listOfSets[0]} right1={listOfSets[1]}
                            left2={listOfSets[2]} right2={listOfSets[3]}
                            left3={listOfSets[4]} right3={listOfSets[5]}/>;
        } else if (gameID == 1) {
        
        } else if (gameID == 2) {
        
        }
    
    return (
        <div>
            {/* <h1>Timer: {seconds}</h1> */}
            <br/>
            {game}
        </div>
    )
}

export default GamePage;