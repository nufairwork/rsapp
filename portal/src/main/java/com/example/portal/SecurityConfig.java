package com.example.portal;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Map;

@Configuration
public class SecurityConfig {
    // define test users
    @Bean
    public UserDetailsService userDetailsService(){
        var userHR = User.withUsername("hruser")
                .password("{noop}password") // {noop} = plain text password for demo
                .roles("HR")
                .build();

        var userInventory = User.withUsername("invuser")
                .password("{noop}password")
                .roles("INVENTORY")
                .build();

        var admin = User.withUsername("admin")
                .password("{noop}admin")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(userHR, userInventory, admin);
    }

    // Configure URL restrictions
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        var objectMapper = new ObjectMapper();

        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                        auth -> auth.requestMatchers("/api/hr/**").hasAnyRole("HR", "ADMIN").requestMatchers("/api/inventory/**").hasAnyRole("INVENTORY", "ADMIN").requestMatchers("/api/me").authenticated().anyRequest().permitAll()
        )
                .formLogin(form -> form.loginProcessingUrl("/api/login")
                        .successHandler(((request, response, authentication) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_OK);
                            var body = Map.of("username", authentication.getName(), "roles", authentication.getAuthorities().stream().map(a -> a.getAuthority()).toList());
                            objectMapper.writeValue(response.getOutputStream(), body);
                        }))
                        .failureHandler(((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        }))
                        .permitAll()
                )
                .logout(logout -> logout.logoutUrl("/api/logout"));
        return http.build();
    }

}
