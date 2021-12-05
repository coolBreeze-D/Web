let p1 = new Promise(resolve => {
    setTimeout(()=>{
        resolve('异步1')
    },1000)
});

let p2 = new Promise(resolve => {
    setTimeout(()=>{
        resolve('异步2')
    },2000)
});

let p3 = new Promise(resolve => {
    setTimeout(()=>{
        resolve('异步3')
    },3000)
});

p1.then(value => console.log(value) );


let test  = async() =>{
    let relute1 = await p1,
        relute2 = await p2,
        relute3 = await p3;

    console.log(relute1 +' async');
    console.log(relute2 +' async');
    console.log('master')
    console.log('master two')
    console.log('hot-qingfeng');
    console.log('hot-qingfeng two')
};

test();