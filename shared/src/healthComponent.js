class HealthComponent {
    constructor(maxhealth) {
        this.maxhealth = maxhealth
        this.health = maxhealth
    }
    Damage(amount) {
        this.health -= amount
        if(this.health <= 0) {
            this.OnDeath()
        }
    }
    Heal(amount) {
        this.health = Math.min(this.maxhealth, this.health+amount)
    }
    GetHealth() {
        return this.health
    }
    IsFull() {
        return this.health < this.maxhealth
    }
    OnDeath() {
        console.log("dead")
    }
    RestoreAllHealth() {
        this.health = this.maxhealth
    }
}

export { HealthComponent }