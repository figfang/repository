package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
	
	@GetMapping("/admin")
    public String adminPage() {
        return "admin";  // 這會返回 templates/admin.html
    }
}

