package com.example.hr;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/employees")
public class EmployeeController {
    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<Employee> getAllEmployees(){
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable Long id){
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee with " + id +" not Found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employee createEmployee(@RequestBody Employee employee){
        return repository.save(employee);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updated){
        Employee emp = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee with " + id +" not Found"));
        emp.setName(updated.getName());
        emp.setDepartment(updated.getDepartment());
        return repository.save(emp);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id){
        Employee emp = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee with " + id +" not Found"));
        repository.deleteById(id);
    }
}
