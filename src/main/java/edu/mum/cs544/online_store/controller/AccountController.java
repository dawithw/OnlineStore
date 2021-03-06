package edu.mum.cs544.online_store.controller;

import edu.mum.cs544.online_store.dto.AccountFormDTO;
import edu.mum.cs544.online_store.dto.RegistrationFormDTO;
import edu.mum.cs544.online_store.model.Account;
import edu.mum.cs544.online_store.model.User;
import edu.mum.cs544.online_store.service.IAccountService;
import edu.mum.cs544.online_store.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.net.http.HttpResponse;
import java.security.Principal;

@Controller
@RequestMapping("/user")
@SessionAttributes({"user","account"})
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @Autowired
    private IUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String getRegistrationPage(Model model) {
        if(!model.containsAttribute("registrationFormDTO"))
            model.addAttribute("registrationFormDTO", new RegistrationFormDTO());
        return "account/registrationForm";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute RegistrationFormDTO registrationFormDTO,
                               BindingResult result,
                               RedirectAttributes redirectAttributes) {
        // TODO validate inputs
        Account account = new Account(registrationFormDTO.getEmail(), passwordEncoder.encode(registrationFormDTO.getPassword()),"ROLE_USER");
        User user = new User(registrationFormDTO.getFirstName(), registrationFormDTO.getLastName());
        user.setAccount(account);
        userService.save(user);
        return "redirect:list";
    }

    @GetMapping("/details/{id}")
    public String getUserDetails(@PathVariable long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        return "account/userDetail";
    }

    @GetMapping("/edit/account/{id}")
    public String getUserAccountDetails(@PathVariable long id, Model model) {
        User user = userService.findById(id);
        Account account = user.getAccount();
        model.addAttribute("user",user);
        model.addAttribute("account",account);
        model.addAttribute("accountFormDTO", new AccountFormDTO(account.getUsername()));
        return "account/credentialUpdateForm";
    }

    @PostMapping("/edit/account")
    public String updateAccount(@Valid @ModelAttribute AccountFormDTO accountFormDTO, BindingResult result, Model model) {
        Account account = (Account)model.asMap().get("account");
        // TODO : Validate old password
        long id = ((User)model.asMap().get("user")).getId();
        account.setPassword(accountFormDTO.getNewPassword());
        accountService.save(account);
        return "redirect:../details/" + id;
    }

    @GetMapping("/edit/{id}")
    public String getEditPage(@PathVariable long id, Model model, Principal principal) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "account/userInfoUpdateForm";
    }

    @PostMapping("/edit")
    public String editUser(@ModelAttribute("user") User user, Model model, SessionStatus status) {
        // TODO validate user information
        userService.save(user);
        status.setComplete();
        return "redirect:/user/details/" + user.getId();
    }

}
