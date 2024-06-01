package com.musicstore.users.security;

import org.springframework.stereotype.Service;

import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailValidator implements Predicate<String> {

    @Override
    public boolean test(String email) {
        Pattern pattern = Pattern.compile("^(?![^\"]+.*[^\"]+\\.\\.)[a-zA-Z0-9 !#\"$%&'*+-/=?^_`{|}~]*[a-zA-Z0-9\"]+@[a-zA-Z0-9.-]+$", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

}
