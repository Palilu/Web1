package com.bebisinc.mantomation;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OrdersPage {

    public void test(WebDriver driver) {
        try {
            // Voy a mi página de pedidos
            driver.get("http://ec2-54-183-161-248.us-west-1.compute.amazonaws.com/pedidos.html");
            testCart(driver);
            testForm(driver);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void testCart(WebDriver driver) {
        // Le hago click al tachito
        driver.findElement(By.id("reset")).click();
        // Me fijo que el carrito quede sin elementos
        List<WebElement> items = driver.findElements(By.cssSelector("#cart tr"));
        assertEquals(0, items.size());
        // Clickeo dos veces agregar 3 alfajores
        driver.findElement(By.id("price3")).click();
        driver.findElement(By.id("price3")).click();
        // Me fijo que el carrito tenga 6 elementos
        items = driver.findElements(By.cssSelector("#cart tr"));
        assertEquals(6, items.size());
        // Me fijo que el ícono de regalos esté visible
        assertNotNull(driver.findElement(By.cssSelector(".fa.fa-gift.visible")));
        // Me fijo que el total esté correcto
        assertEquals(driver.findElement(By.id("total"))
                .getAttribute("innerHTML"), "<p class=\"oldPrice\">$450</p><p>$420</p>");
    }

    private void testForm(WebDriver driver) throws InterruptedException {
        // Completo nombre, apellido, email y telefono
        driver.findElement(By.id("nombre")).sendKeys("Gerald");
        driver.findElement(By.id("apellido")).sendKeys("Smith");
        driver.findElement(By.name("email")).sendKeys("jerry@rm.com");
        driver.findElement(By.name("telefono")).sendKeys("555-555-5555");
        // Obtengo el valor del captcha y lo lleno en el formulario
        String captcha = driver.findElement(By.id("captcha-txt")).getAttribute("innerHTML");
        driver.findElement(By.id("captcha-inp")).sendKeys(captcha);
        // Submiteo el formulario
        driver.findElement(By.id("submit-btn")).click();
        // Espero 1 segundo
        Thread.sleep(1000L);
        // Me fijo que el nombre esté vacio
        assertEquals("", driver.findElement(By.id("nombre")).getAttribute("value"));
    }
}
