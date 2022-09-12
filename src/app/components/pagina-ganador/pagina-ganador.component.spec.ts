import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaGanadorComponent } from './pagina-ganador.component';

describe('PaginaGanadorComponent', () => {
  let component: PaginaGanadorComponent;
  let fixture: ComponentFixture<PaginaGanadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaGanadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaGanadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
