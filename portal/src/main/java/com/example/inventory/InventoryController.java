package com.example.inventory;

import com.example.hr.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/items")
public class InventoryController {
    private final InventoryRepository repository;

    public InventoryController(InventoryRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<InventoryItem> getAllItems(){
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public InventoryItem getItem(@PathVariable Long id){
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item with " + id +" not Found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryItem createItem(@RequestBody InventoryItem item){
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public InventoryItem updateItem(@PathVariable Long id, @RequestBody InventoryItem updated){
        InventoryItem item = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item with " + id +" not Found"));
        item.setName(updated.getName());
        item.setQuantity(updated.getQuantity());
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id){
        InventoryItem item = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item with " + id +" not Found"));
        repository.deleteById(id);
    }
}
