#!/usr/bin/env python3
"""Import the complete approved DOCX course without shortening its lessons."""
from docx import Document
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph
from pathlib import Path
import json, re

source = Path("course-import/content-manager-ai.docx")
if not source.exists():
    raise SystemExit("Upload course-import/content-manager-ai.docx first")
doc = Document(source)
items = []
for node in doc.element.body.iterchildren():
    if node.tag == qn("w:p"):
        p = Paragraph(node, doc)
        s = p.text.strip()
        if s:
            items.append((p.style.name, s))
    elif node.tag == qn("w:tbl"):
        table = Table(node, doc)
        for row in table.rows:
            cells = [" ".join(p.text.strip() for p in cell.paragraphs if p.text.strip()) for cell in row.cells]
            if any(cells):
                items.append(("table", " | ".join(cells)))
lessons = []
current = None
in_exam = False
for style, s in items:
    m = re.match(r"^УРОК\s+(\d{1,2})\.\s*(.+)$", s, re.I)
    if m and style.lower().startswith("heading"):
        number = int(m.group(1))
        if not 1 <= number <= 20 or number != len(lessons) + 1:
            raise SystemExit(f"Invalid lesson numbering: {number}")
        current = {"id": f"content-manager-ai-lesson-{number}", "title": m.group(2), "duration": "Самостоятельное изучение", "content": []}
        lessons.append(current)
        in_exam = False
        continue
    if s.upper().startswith("ИТОГОВАЯ КОНТРОЛЬНАЯ АТТЕСТАЦИЯ"):
        in_exam = True
        continue
    if current and not in_exam:
        current["content"].append(s)
    elif current and in_exam:
        # The examination follows lesson 20, not every lesson.
        current["content"].append("ИТОГОВАЯ АТТЕСТАЦИЯ: " + s if s.startswith("Порядок") else s)
if len(lessons) != 20 or any(len(l["content"]) < 15 for l in lessons):
    raise SystemExit("Incomplete source: expected 20 full lessons")
def js(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2)
skills = ["Планировать контент на 30 дней", "Писать тексты и промпты для нейросетей", "Создавать изображения, карточки и видео", "Анализировать аудиторию и эффективность публикаций", "Готовить портфолио и работать с заказчиками"]
result = {"skills": skills, "tasks": ["Контент-план", "Публикации и визуалы", "Видео и SEO", "Отчётность и портфолио"], "workplaces": ["Малый бизнес", "Контент-агентства", "Удалённые проекты"]}
profession = {
 "slug":"content-manager-ai", "title":"Контент-менеджер с использованием нейросетей", "direction":"Контент и нейросети",
 "description":"Полный практический курс с нуля: тексты, визуалы, видео, контент-стратегия, аналитика, нейросети и портфолио.",
 "audience":["Начинающие без опыта в контенте и ИИ","Люди, осваивающие удалённую профессию","Предприниматели и специалисты, создающие контент"],
 "outcome":"Создание полного контент-проекта и портфолио с использованием нейросетей.",
 "learningResult":result,
 "careerPath":[{"title":"Старт","description":"Тексты, промпты и контент-план"},{"title":"Практика","description":"Визуалы, видео и аналитика"},{"title":"Развитие","description":"Проекты для клиентов и портфолио"}],
 "packages":[{"slug":"full","title":"Полный курс","subtitle":"20 уроков и итоговая аттестация","price":"6 900 ₽","includedLevelSlugs":["basic"],"includes":skills,"result":"Готовое портфолио контент-менеджера","bestFor":"Для обучения с нуля","featured":True}],
 "levels":[{"slug":"basic","title":"Полный курс","label":"Профессия","duration":"Самостоятельное изучение","price":"6 900 ₽","level":"basic","description":"20 подробных уроков, практические задания и одна итоговая аттестация","result":"Контент-стратегия, публикации и портфолио","learningResult":result,"modules":[{"id":"content-manager-ai-full","title":"Контент-менеджер с использованием нейросетей","description":"20 подробных практических уроков и итоговая аттестация","lessons":lessons,"completedTitle":"Итог курса","completedItems":["Контент-стратегия и календарь","Тексты, изображения и видео","Итоговое портфолио и аттестация"]}],"finalSummary":"Итоговая аттестация после урока 20: тестовые вопросы и практический проект."}],
 "accessRules":{"tokenScope":"package","tokenTtlDays":365,"delivery":"email","requiresPayment":True}
}
out = Path("data/professions/content-manager-ai/index.ts")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text('import type { Profession } from "@/data/professions/types";\nexport const contentManagerAiProfession: Profession = ' + js(profession) + ';\n',encoding="utf-8")
index = Path("data/professions/index.ts")
text = index.read_text(encoding="utf-8")
imp = 'import { contentManagerAiProfession } from "@/data/professions/content-manager-ai";\n'
if imp not in text:
    text = imp + text
if '  contentManagerAiProfession,' not in text:
    text = text.replace('  accountingProfession,', '  accountingProfession,\n  contentManagerAiProfession,')
index.write_text(text,encoding="utf-8")
print(f"Imported {len(lessons)} lessons and {sum(len(x['content']) for x in lessons)} paragraphs")
