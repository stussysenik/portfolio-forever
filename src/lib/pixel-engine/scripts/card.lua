-- Card: poker card that floats gently, tilts toward mouse
function update(dt, self, ctx)
  -- Gentle float
  local vy = self.vy + math.sin(self.x * 0.01 + ctx.scrollY * 0.005) * 10 * dt
  local vx = self.vx + math.cos(self.y * 0.01) * 5 * dt

  -- Slow drift downward
  vy = vy + 5 * dt

  -- Dampen
  vx = vx * 0.99
  vy = vy * 0.99

  return {
    x = self.x + vx * dt,
    y = self.y + vy * dt,
    vx = vx,
    vy = vy
  }
end
