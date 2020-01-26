const Letters : String[] = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

const Bools : Boolean[] = [
    false, true, true, false, true, false, false, true
]

export default function GenerateToken ( ) : string
{
    let Token : string = "";

    for(  let i = 0; i <= 35; i++)
    {
        if(GetRandomBool())
            Token += GetRandomLetter();
        else
        {
            let random_number : Number = Math.floor( (Math.random() * 10) + 1 );
            Token += random_number;
        }
        
    }
    return Token;
}

function GetRandomLetter() : String
{
    let letter = GetRandomItem( Letters );
    return GetRandomBool() ? letter : letter.toLowerCase();
}

const GetRandomBool = () => GetRandomItem( Bools );


function GetRandomItem( TheArray : Array<Object>) : any
{
    let array_size : number = TheArray.length - 1;
    let Index = Math.floor( (Math.random() * array_size) + 1 );
    return TheArray[Index];
}