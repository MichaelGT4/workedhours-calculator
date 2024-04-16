import express, {Request, Response} from 'express'
const app = express()
const port = 3000

app.use(express.json())

type Employee = {
    id: number,
    cedula: string,
    fullname: string,
    pricePerHour: number
}

// Test De un PR

type WorkedHour = {
    employeeId: number,
    hours: number,
}

let idSecuence = 0

let  employees: Employee[] = []
let  workedHours:WorkedHour[]= []

// obtener todos los empleados registrados
app.get('/employee', (req: Request, res:Response) =>{
    res.json(employees)
})

// obtener un empleado enviando el id
app.get('/employee/:id', (req: Request, res:Response) =>{
    const { id } = req.params;

    if(isNaN(Number(id))){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: `The parameter ${id} must be a number`
        })
    }
    const employee = employees.find((employee)=> employee.id == Number(id))

    if(!employee){
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not found',
            message:`Employee with the ID ${id} does not exist.`
        })
    }
    res.json(employee)
})

// obtiene todas las horas trabajadas por un empleado, enviando el id
app.get('/employee/:id/hours', (req: Request, res: Response) =>{
    const  { id } = req.params

    if(isNaN(Number(id))){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: `The parameter ${id} must be a number`
        })
    }
    
    const existsHours = workedHours.filter((workedHour)=> workedHour.employeeId === Number(id) )
    const existsEmployee = employees.find((employee)=> employee.id === Number(id))

    if (!existsEmployee) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: "Not Found",
            message:`The employee with the ID ${id} was not found`
        });
    }

    if(existsHours.length === 0 ){
        return res.status(404).json({
            statusCode: 404,
            statusValue:'Not Found',
            message: "The list of working hours is empty"
        });
    };
    res.json(existsHours)
})

// obtiene el salario a pagar basandose en el total de horas por el precio de hora del empleado
app.get('/employee/:id/salary', (req: Request, res:Response) => {
    const { id } = req.params
    
    if(isNaN(Number(id))){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: `The parameter ${id} must be a number`
        })
    }
    
    const employee = employees.find((employee) => employee.id === Number(id));
    const workedHour = workedHours.filter((workedHour)=> workedHour.employeeId === Number(id) )

    const totalHours = workedHour.reduce((total, currentHour) => total + currentHour.hours ,0);
    
    if(!employee || !workedHour){
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not found' ,
            message:`Employee with the ID=${id} does not exist or The worked hour for this Employee was not registered.`
        })
    }
    
    const salary = totalHours * employee.pricePerHour;

    res.json({
        Id: employee.id,
        employee: employee.fullname,
        salary: salary
    })  
})

// agrega un empleado nuevo
app.post('/employee', (req: Request, res:Response) => {
    const {fullname, cedula, pricePerHour} = req.body;

    if(!fullname || !cedula || !pricePerHour ){
        return res.status(400).json({
            statusCode:400, 
            statusValue:'Bad Request', 
            message: 'No puede haber campos vacios.'
        })
    }

    if (employees.find((employee) => employee.cedula === cedula)){
        return res.status(400).json({
            statusCode:400,  
            statusValue:'Bad Request',  
            message: `La Cedula ${cedula} ya existe.`
        });
    } 

    idSecuence +=1
    const newEmployee = {
        id : idSecuence,
        fullname,
        cedula,
        pricePerHour
    }
    employees.push(newEmployee)
    res.json(newEmployee)
})

// agrega un registro nuevo de horas usando el id del empleado para asociar las horas
app.post('/employee/:id/hours', (req: Request, res: Response) => {
    const {id} = req.params
    const { hours } = req.body
    
    if(isNaN(Number(id))){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: `The parameter ${id} must be a number`
        })
    }

    if (!hours || typeof hours !== "number"){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: 'The field Hours must be a Number'
        })
    }

    const existsEmployee = employees.find((employee) => employee.id == Number(id))

    if (!existsEmployee){
        return res.status(404).json({
            statusCode: 404,
            statusValue: "Not Found",
            message:"El Empleado no Existe"
        })
    }

    const  hourRegistration = {
        employeeId: Number(id),
        hours
    }

    workedHours.push(hourRegistration)
    res.json(hourRegistration)
})

// actualiza la informacion del empleado (solo el fullname y pricePerhours)
app.put('/employee/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { fullname, pricePerHour } = req.body
    if (isNaN(Number.parseInt(id))) {
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `id: ${id} is Not a Number`
        })
    }

    if (!fullname || !pricePerHour){
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `fullname and price per hour are required`
        })
    }

    let existsEmployee = employees.find((employee) => employee.id === Number(id))

    if (!existsEmployee) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not found',
            message:'Empleado No Encontrado'
        })
    }

    existsEmployee.fullname = fullname
    existsEmployee.pricePerHour = pricePerHour
    
    res.json(existsEmployee)
})

// borra un empleado y todo el registro de las horas trabajadas
app.delete("/employee/:id", (req:Request,res:Response)=>{
    const { id }=req.params;
    
    if (isNaN(Number.parseInt(id))) {
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `id: ${id} is Not a Number`
        })
    }
    
    const existsEmployee = employees.find((employee:Employee)=> employee.id === Number(id))

    if (!existsEmployee) {
        return res.sendStatus(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        })
    }

    const empIndex = employees.findIndex((employee) => employee.id === Number.parseInt(id));
    const hoursIndex = workedHours.findIndex((hours) => hours.employeeId === Number(id));

    if (workedHours[empIndex]){
        workedHours.splice(hoursIndex,1)
    }
    employees.splice(empIndex,1);

    
    res.json({
        statusCode:200,
        statusValue:"OK",
        message:`The employee with ID ${id} has been deleted`
    })

})

app.listen(port, () => console.log(`App is listening on port ${port}!`))