# Calculo de Horas Empleados

Crear un API para manejar registro de horas pagadas a empleados, debe contener los siguientes endpoint:

- `(get) /employee` -> obtener todos los empleados registrados

- `(get) /employee/:id` -> obtener un empleado enviando el id
- `(get) /employee/:id/hours` -> obtiene todas las horas trabajadas por un empleado, enviando el id
- `(get) /employee/:id/salary` -> obtiene el salario a pagar basandose en el total de horas por el precio de hora del empleado
- `(post) /employee` -> agrega un empleado nuevo
- `(post) /employee/:id/hours` -> agrega un registro nuevo de horas usando el id del empleado para asociar las horas
- `(put) /employee/:id` -> actualiza la informacion del empleado (solo el fullname y pricePerhours)
- `(delete) / employee` -> borra un empleado y todo el registro de las horas trabajadas

Para lograr esto crearemos 2 tipos: `Employee` y `WorkedHour`

```bash
  Tipo Employee
```

| Parameter      | Type     |
| :------------- | :------- |
| `id`           | `int`    |
| `cedula`       | `string` |
| `fullname`     | `string` |
| `pricePerHour` | `int`    |

```bash
Tipo WorkedHour:
```

| Parameter    | Type     |
| :----------- | :------- |
| `EmployeeId` | `string` |
| `hours`      | `int`    |

## 📝 Nota Importante

Utilizaremos 2 listas como base de datos:
`employees: Employee[ ]` y
`workedHours: WorkedHour[ ]`

En la primera se registraran los empleados con un id autogenerado, mientras que en la segunda se registraran las horas de trabajo de cada empleado, enviado el id del empleado para asociar cada registro.

> Se requiere que se validen los valores enviados (id, fullname, cedula, pricePerHour)
> entre las validaciones la cedula no puede estar repetida
